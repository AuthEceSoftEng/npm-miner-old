//
// Requires
//
const bunyan = require('bunyan');
const amqp = require('amqplib');
const path = require('path');
const fs = require('fs');
const targz = require('targz');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');
const rimraf = require('rimraf');
const _ = require('lodash');
const GitHubApi = require('github');
const npmdb = require('nano')({
  url: 'http://couchdb.npm-miner.com:5984/npm-registry-2',
  agentOptions: {
    rejectUnauthorized: false
  }
});
Promise.promisifyAll(npmdb);
const npmpackages = require('nano')({
  url: 'http://couchdb.npm-miner.com:5984/npm-packages',
  agentOptions: {
    rejectUnauthorized: false
  }
});
Promise.promisifyAll(npmpackages);
const request = require('request-promise');
const shell = require('shelljs');
const escomplex = require('escomplex');
const { CLIEngine } = require('eslint');
const glob = require('globby');
const consts = require('./consts');

function makeid() {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

//
// Configuration and Variables
//
const pid = process.argv[2];
//const pid = makeid();
const logger = bunyan.createLogger({
  name: 'worker',
  streams: [
    {
      stream: process.stdout,
      level: 'info'
    },
    {
      type: 'rotating-file',
      path: `./output${pid}.log`,
      level: 'info',
      period: '1d', // daily rotation
      count: 3 // keep 3 back copies
    }
  ]
});

loggerWarn = logger.warn.bind(logger);

const qin = 'filter';
const url =
  // 'amqp://localhost' ||
  // process.env.CLOUDAMQP_URL ||
  'amqp://snf-779950.vm.okeanos.grnet.gr';
const dest = `./downloads${pid}`;
const github = new GitHubApi({
  version: '3.0.0',
  debug: false,
  protocol: 'https',
  host: 'api.github.com',
  followRedirects: true,
  timeout: 5000,
  headers: {
    'user-agent': 'github-downloader'
  },
  Promise: Promise
});
github.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});
const environments = ['es6'];
const cli = new CLIEngine({
  envs: environments,
  useEslintrc: false,
  rules: {
    // Warnings
    'no-cond-assign': [1, 'except-parens'],
    'no-extra-semi': 1,
    'no-irregular-whitespace': 1,
    'no-unexpected-multiline': 1,
    'default-case': 1,
    eqeqeq: 1,
    'no-empty-function': 1,
    'no-multi-spaces': 1,
    'no-unused-labels': 1,
    yoda: [1, 'never'],
    'max-depth': 1,
    'max-nested-callbacks': 1,
    'no-trailing-spaces': 1,

    // Errors
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 2,
    'no-empty-character-class': 2,
    'no-func-assign': 2,
    'no-invalid-regexp': 2,
    'no-unreachable': 2,
    'use-isnan': 2,
    'no-redeclare': 2,
    'no-self-assign': 2,
    'no-shadow': 2,
    'no-use-before-define': 2,
    'no-unused-vars': 2
  }
});

//
// Functions
//
function readCode(pathToCode) {
  if (fs.lstatSync(pathToCode).isDirectory()) {
    return {
      path: pathToCode,
      code: null
    };
  }
  return {
    path: pathToCode,
    code: fs
      .readFileSync(pathToCode)
      .toString()
      .trim()
  };
}

function createGlobbyPattern(localPath) {
  return [
    `${localPath}/**/*.js`,
    `!${localPath}/test*/**/*`,
    `!${localPath}/grunt/**/*`,
    `!${localPath}/node_modules*/**/*`,
    `!${localPath}/bower_components*/**/*`,
    `!${localPath}/**/example*/**/*`,
    `!${localPath}/**/*min.js`,
    `!${localPath}/**/config.js`,
    `!${localPath}/**/[Gg]ulp[Ff]ile.*`,
    `!${localPath}/**/[Gg]runt[Ff]ile.*`,
    `!${localPath}/**/*spec.js`,
    `!${localPath}/**/*spec*/*`,
    `!${localPath}/dist/**/*`,
    `!${localPath}/build/**/*`,
    `!${localPath}/**/*benchmark*/**/*`,
    `!${localPath}/**/*dist*/**/*`,
    `!${localPath}/**/*plugins*/**/*`,
    `!${localPath}/**/*build*/**/*`,
    `!${localPath}/**/*vendors*/**/*`,
    `!${localPath}/**/*node_modules*/**/*`,
    `!${localPath}/**/*bower_components*/**/*`,
    `!${localPath}/**/*build.js`,
    `!${localPath}/**/*tests?.js`,
    `!${localPath}/**/*webpack*`
  ];
}

function delay(t) {
  return new Promise(function(resolve) {
    setTimeout(resolve, t);
  });
}

// Work, work, work
amqp
  .connect(url)
  .then(conn => {
    let ok = conn.createChannel();
    ok = ok
      .then(ch => {
        return Promise.all([ch, ch.assertQueue(qin, { durable: true })]);
      })
      .then(([ch, ok]) => {
        ch.prefetch(1);
        return ch.consume(
          qin,
          msg => {
            if (msg !== null) {
              const job = JSON.parse(msg.content.toString());
              logger.info(`[1] Got job for package: ${job.package_name}`);
              return npmdb
                .getAsync(job.package_name)
                .delay(2000)
                .then(doc => {
                  const package = {};
                  let localPath;
                  logger.info(`[2] Retrieved: ${doc._id}`);
                  if (
                    doc.name &&
                    doc.name === job.package_name &&
                    doc.repository &&
                    doc.repository.url &&
                    new RegExp(
                      /https:[\/][\/]github[\.]com[\/][a-zA-Z0-9\-]+[\/][a-zA-Z0-9\-]+/g
                    ).test(doc.repository.url)
                  ) {
                    package._id = doc.name;
                    package.name = doc.name;
                    package.date = Date.now();
                    const github_repository = doc.repository.url.match(
                      /https:[\/][\/]github[\.]com[\/][a-zA-Z0-9\-]+[\/][a-zA-Z0-9\-]+/g
                    )[0];
                    package.github_repository = github_repository;
                    package.latest_package_json =
                      doc.versions[doc['dist-tags'].latest];
                    let split = package.github_repository.split('/');
                    let user = split[3];
                    let repo = split[4];
                    logger.info(
                      `[3] Package name: ${package.name} of user: ${user} in repo: ${repo}`
                    );
                    return github.repos
                      .getContent({
                        owner: user,
                        repo: repo,
                        path: 'package.json'
                      })
                      .then(res => {
                        let download_url = res.data.download_url;
                        logger.info(
                          `[4] Downloading package.json from: ${download_url}`
                        );
                        return request({ uri: download_url, json: true });
                      })
                      .then(json => {
                        logger.info(
                          `[5] The package name in json is: ${json.name}`
                        );
                        if (json.name === package.name) {
                        } else {
                          package.error = 'name-missmatch';
                        }
                        return request({
                          url: `https://api.npms.io/v2/package/${package.name}`,
                          json: true
                        });
                      })
                      .then(json => {
                        logger.info(`[6] The score is  ${json.score.final}`);
                        package.npmsio = json;
                        return github.repos.get({
                          owner: user,
                          repo: repo
                        });
                      })
                      .then(res => {
                        logger.info(
                          `[6] Stars ${user}/${repo}: ${res.data
                            .stargazers_count}`
                        );
                        if (
                          res.data.html_url.includes(user) &&
                          res.data.html_url.includes(repo)
                        ) {
                          package.stars = res.data.stargazers_count;
                          logger.info(
                            `[7] Store package ${package.name} with ${res.data
                              .stargazers_count} GitHub stars!`
                          );
                        } else {
                          package.error = 'redirect';
                        }
                        return Promise.resolve('Starting the analysis');
                      })
                      .then(() => {
                        mkdirp.sync(dest);
                        const url = package.latest_package_json.dist.tarball;
                        logger.info(`[8] Downloading tarball from: ${url}`);
                        let filename = url.substr(url.lastIndexOf('/'));
                        const tarzball = path.join(dest, filename);
                        const targetDir = path.join(
                          dest,
                          filename.slice(0, -4)
                        );
                        localPath = targetDir;
                        return new Promise((resolve, reject) => {
                          request(url)
                            .pipe(fs.createWriteStream(tarzball))
                            .on('error', function(err) {
                              console.log('error 1');
                              console.log(err);
                              reject(callback());
                            })
                            .on('end', () => {
                              console.log('the end');
                            })
                            .on('finish', function() {
                              targz.decompress(
                                {
                                  src: tarzball,
                                  dest: targetDir
                                },
                                function(err) {
                                  if (err) {
                                    console.log(err);
                                    return reject('error 2');
                                  } else {
                                    console.log('Done!');
                                    return resolve('Job done!');
                                  }
                                }
                              );
                            });
                        });
                      })
                      .then(() => {
                        logger.info(`[9] Starting analysis on ${package._id}`);
                        return glob(createGlobbyPattern(localPath), {
                          nodir: true
                        });
                      })
                      .then(paths => {
                        logger.info(`[10] Files identified: ${paths.length}`);
                        if (paths.length <= 1000) {
                          package.numOfFiles = paths.length;
                          const directories = _.map(paths, path => {
                            return path.split('/').length - 4;
                          });
                          package.minDirDepth = _.min(directories);
                          package.maxDirDepth = _.max(directories);
                          package.sumDirDepth = _.sum(directories);
                          logger.info(`[11] Running eslint`);
                          let result = cli.executeOnFiles(paths);
                          package.eslint = {
                            errorCount: result.errorCount,
                            warningCount: result.warningCount
                          };
                          logger.info(`[12] Running escomplex`);
                          const source = _.chain(paths)
                            .map(readCode)
                            .reject(['code', null])
                            .value();
                          let escomplexResult = escomplex.analyse(source, {
                            ignoreErrors: true
                          });
                          let tlocp = _.sumBy(
                            escomplexResult.reports,
                            o => o.aggregate.sloc.physical
                          );
                          let tlocl = _.sumBy(
                            escomplexResult.reports,
                            o => o.aggregate.sloc.logical
                          );
                          package.escomplex = {
                            firstOrderDensity:
                              escomplexResult.firstOrderDensity,
                            changeCost: escomplexResult.changeCost,
                            coreSize: escomplexResult.coreSize,
                            loc: escomplexResult.loc,
                            cyclomatic: escomplexResult.cyclomatic,
                            effort: escomplexResult.effort,
                            params: escomplexResult.params,
                            maintainability: escomplexResult.maintainability,
                            tlocp,
                            tlocl
                          };
                          logger.info(`[13] Running nsp`);
                          const nspAnalysis = shell.exec(
                            `./node_modules/.bin/nsp check ${path.join(
                              localPath,
                              'package'
                            )} --reporter json`,
                            { silent: true }
                          ).stdout;
                          if (nspAnalysis) {
                            package.nsp = JSON.parse(nspAnalysis).length;
                          } else {
                            package.nsp = 0;
                          }
                          logger.info(`[14] Cleaning up`);
                          rimraf.sync(dest);
                          return npmpackages.getAsync(job.package_name);
                        } else {
                          rimraf.sync(dest);
                          return Promise.reject(
                            'Too many files (more than 1000)'
                          );
                        }
                      })
                      .then(res => {
                        package._rev = res._rev;
                        logger.info('[End] New package added (updated)!');
                        return npmpackages.insertAsync(package);
                      })
                      .catch(err => {
                        if (err.message === 'missing') {
                          logger.info('[End] New package added (created)!');
                          logger.error(err);
                          return npmpackages.insertAsync(package);
                        } else {
                          logger.info('Bucket error 1');
                          logger.error(err);
                        }
                      })
                      .catch(err => {
                        logger.info('Bucket error 2');
                        logger.error(err);
                      });
                  } else {
                    return Promise.reject(
                      'Not able to connect to github due to parsed URL'
                    );
                  }
                })
                .catch(err => {
                  console.error(err);
                  if (err.message == 'Not Found') {
                    package.error = 'not-found';
                    logger.error('Repo not found in github parsed URL');
                  }
                })
                .finally(() => {
                  logger.info('[End] Done and Acknowledgement!');
                  ch.ack(msg);
                });
            }
          },
          { noAck: false }
        );
      })
      .catch(err => {
        logger.error(err);
      })
      .finally(() => {
        logger.info('--- Done ---');
      });
    return ok;
  })
  .then(null, loggerWarn);

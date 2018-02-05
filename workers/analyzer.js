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
Promise.config({
  cancellation: true
});
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
Promise.promisifyAll(shell);
const escomplex = require('escomplex');
const { analyze } = require('sonarjs');
const { CLIEngine } = require('eslint');
const glob = require('globby');

//
// Configuration and Variables
//
function makeid() {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

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

// Function for logging purposes
function log(message) {
  logger.info(message);
}

function onStart() {
  logger.info('Sonarjs analysis started');
}

function onEnd() {
  logger.info('Sonarjs analysis finished');
}

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

function eslintTask(paths) {
  return new Promise((resolve, reject) => {
    logger.info(`--- Running eslint ---`);
    let result = cli.executeOnFiles(paths);
    return resolve({
      errorCount: result.errorCount,
      warningCount: result.warningCount
    });
  });
}

function escomplexTask(paths) {
  return new Promise((resolve, reject) => {
    logger.info(`--- Running escomplex ---`);
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
    let tlocl = _.sumBy(escomplexResult.reports, o => o.aggregate.sloc.logical);
    return resolve({
      firstOrderDensity: escomplexResult.firstOrderDensity,
      changeCost: escomplexResult.changeCost,
      coreSize: escomplexResult.coreSize,
      loc: escomplexResult.loc,
      cyclomatic: escomplexResult.cyclomatic,
      effort: escomplexResult.effort,
      params: escomplexResult.params,
      maintainability: escomplexResult.maintainability,
      tlocp,
      tlocl
    });
  });
}

function nspTask(localPath) {
  return new Promise((resolve, reject) => {
    logger.info(`--- Running nsp ---`);
    const nspAnalysis = shell.exec(
      `./node_modules/.bin/nsp check ${path.join(
        localPath,
        'package'
      )} --reporter json`,
      { silent: true }
    ).stdout;
    if (nspAnalysis) {
      return resolve(JSON.parse(nspAnalysis).length);
    } else {
      return resolve(0);
    }
  });
}

function jsinspectTask(localPath) {
  return new Promise((resolve, reject) => {
    logger.info(`--- Running jsinspect ---`);
    shell
      .exec(
        `./node_modules/.bin/jsinspect -t 40 --reporter default --ignore 'node_modules'
      ${localPath}`,
        { silent: true }
      )
      .to(`jsinspect${pid}.out`);
    const jsinspectAnalysis = shell.exec(
      `grep Match jsinspect${pid}.out | wc -l`,
      { silent: true }
    ).stdout;
    const numberOfDup = jsinspectAnalysis.replace(/\s/g, '');
    return resolve(parseInt(numberOfDup));
  });
}

async function runSonarJS(project_path, exclusions) {
  const issues = await analyze(project_path, {
    log,
    onStart,
    onEnd,
    exclusions: exclusions
  });
  return issues;
}

function sonarjsTask(localPath, exclude = '') {
  return new Promise((resolve, reject) => {
    logger.info(`--- Running sonarjs ---`);
    return resolve(runSonarJS(localPath, exclude));
  });
}

function promiseAllTimeout(promises, timeout, resolvePartial = true) {
  return new Promise(function(resolve, reject) {
    let results = [],
      finished = 0,
      numPromises = promises.length;
    let onFinish = function() {
      if (finished < numPromises) {
        if (resolvePartial) {
          resolve(results);
        } else {
          throw new Error(
            'Not all promises completed within the specified time'
          );
        }
      } else {
        resolve(results);
      }
      onFinish = null;
    };
    for (let i = 0; i < numPromises; i += 1) {
      results[i] = undefined;
      promises[i].then(function(res) {
        results[i] = res;
        finished += 1;
        if (finished === numPromises && onFinish) {
          onFinish();
        }
      }, reject);
    }
    setTimeout(function() {
      if (onFinish) {
        onFinish();
      }
    }, timeout);
  });
}

// function sonarjsTask(localPath, exclude = "") {
//   return resolve();
// }

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
              const package = {};
              let localPath;
              let paths;
              return npmdb
                .getAsync(job.package_name)
                .delay(2000)
                .then(doc => {
                  logger.info(`[2] Retrieved: ${doc._id}`);
                  if (
                    doc.name &&
                    doc.name === job.package_name &&
                    doc.repository &&
                    doc.repository.url &&
                    new RegExp(
                      /[\/][\/]github[\.]com[\/][a-zA-Z0-9\-]+[\/][a-zA-Z0-9\-]+/g
                    ).test(doc.repository.url)
                  ) {
                    package._id = doc.name;
                    package.error = '';
                    package.name = doc.name;
                    package.date = Date.now();
                    const github_repository = `https:${doc.repository.url.match(
                      /[\/][\/]github[\.]com[\/][a-zA-Z0-9\-]+[\/][a-zA-Z0-9\-]+/g
                    )[0]}`;
                    package.github_repository = github_repository;
                    logger.info(`[3] Identified repo: ${github_repository}`);
                    package.latest_package_json =
                      doc.versions[doc['dist-tags'].latest];
                    let split = package.github_repository.split('/');
                    let user = split[3];
                    let repo = split[4];
                    logger.info(
                      `[3] Package name: ${package.name} of user: ${user} in repo: ${repo}`
                    );
                    const tasks = [];
                    tasks.push(
                      request({
                        url: `https://api.npms.io/v2/package/${package.name}`,
                        json: true
                      })
                    );
                    tasks.push(
                      github.repos.get({
                        owner: user,
                        repo: repo
                      })
                    );
                    return Promise.all(tasks).then(res => {
                      const npmsio = res[0];
                      const github = res[1];
                      logger.info(`[6] The score is  ${npmsio.score.final}`);
                      package.npmsio = npmsio;
                      logger.info(
                        `[7] Stars ${user}/${repo}: ${github.data
                          .stargazers_count}`
                      );
                      if (
                        github.data.html_url.includes(user) &&
                        github.data.html_url.includes(repo)
                      ) {
                        package.stars = github.data.stargazers_count;
                        logger.info(
                          `[8] Store package ${package.name} with a repo of ${github
                            .data.stargazers_count} GitHub stars!`
                        );
                      } else {
                        package.error = 'redirect';
                      }
                      mkdirp.sync(dest);
                      const url = package.latest_package_json.dist.tarball;
                      logger.info(`[9] Downloading tarball from: ${url}`);
                      let filename = url.substr(url.lastIndexOf('/'));
                      const tarzball = path.join(dest, filename);
                      const targetDir = path.join(dest, filename.slice(0, -4));
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
                    });
                  } else {
                    return Promise.reject(
                      'Not able to connect to github due to parsed URL'
                    );
                  }
                })
                .then(() => {
                  logger.info(`[9] Starting analysis on ${package._id}`);
                  return glob(createGlobbyPattern(localPath), {
                    nodir: true
                  });
                })
                .then(paths => {
                  paths = paths;
                  logger.info(`[10] Files identified: ${paths.length}`);
                  package.numOfFiles = paths.length;
                  const directories = _.map(paths, path => {
                    return path.split('/').length - 4;
                  });
                  package.minDirDepth = _.min(directories);
                  package.maxDirDepth = _.max(directories);
                  package.sumDirDepth = _.sum(directories);
                  return eslintTask(paths);
                })
                .then(res => {
                  if (res) package.eslint = res;
                  return escomplexTask(paths);
                })
                .then(res => {
                  if (res) package.escomplex = res;
                  logger.info(res);
                  return nspTask(localPath);
                })
                .then(res => {
                  if (res) package.nsp = res;
                  logger.info(res);
                  return jsinspectTask(localPath);
                })
                .then(res => {
                  if (res) package.jsinspect = res;
                  logger.info(res);
                  return sonarjsTask(localPath, ['node_modules', 'dist']);
                })
                .then(res => {
                  if (res) package.sonarjs = res.length;
                  logger.info(res);
                  logger.info('Finished all');
                  rimraf.sync(dest);
                  return npmpackages.getAsync(job.package_name);
                })
                .then(res => {
                  package._rev = res._rev;
                  logger.info('[End] New package added (updated)!');
                  return npmpackages.insertAsync(package);
                })
                .catch(err => {
                  if (err.message === 'missing') {
                    logger.info('[Error] New package added (created)!');
                    logger.error(err);
                    return npmpackages.insertAsync(package);
                  } else if (err.message === 'operation timed out') {
                    logger.info('[Error] Timeout!');
                    rimraf.sync(dest);
                  } else {
                    rimraf.sync(dest);
                    logger.info('[Error] Something happened');
                    logger.error(err);
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

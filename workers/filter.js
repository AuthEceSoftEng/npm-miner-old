const qin = 'filter';
const qout = 'analysis';
const url =
  process.env.NPM_MINER_CLOUDAMQP_URL ||
  'amqp://snf-782941.vm.okeanos.grnet.gr';
const bunyan = require('bunyan');
const logger = bunyan.createLogger({
  name: 'worker',
  streams: [
    {
      stream: process.stdout,
      level: 'info'
    },
    {
      path: './output.log',
      level: 'info'
    }
  ]
});
const amqp = require('amqplib');
const consts = require('./consts');
const path = require('path');
const fs = require('fs');
const targz = require('targz');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');
const rimraf = require('rimraf');
const _ = require('lodash');
const GitHubApi = require('github');
const npmdb = require('nano')('http://couchdb.npm-miner.com:5984/npm-registry');
Promise.promisifyAll(npmdb);
const npmpackages = require('nano')(
  'http://couchdb.npm-miner.com:5984/npm-packages'
);
Promise.promisifyAll(npmpackages);
const request = require('request-promise');
const shell = require('shelljs');
const escomplex = require('escomplex');
const { CLIEngine } = require('eslint');
const glob = require('globby');

const dest = './downloads';

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
              console.log(job);
              return npmdb
                .getAsync(job.package_name)
                .delay(5000)
                .then(doc => {
                  const package = {};
                  let localPath;
                  logger.info(`Working with package: ${job.package_name}`);
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
                      `1. Package name: ${package.name} user: ${user} repo: ${repo}`
                    );
                    return github.repos
                      .getContent({
                        owner: user,
                        repo: repo,
                        path: 'package.json'
                      })
                      .delay(1000)
                      .then(res => {
                        let download_url = res.data.download_url;
                        logger.info(
                          `2. Downloading package.json from: ${download_url}`
                        );
                        return request({ uri: download_url, json: true });
                      })
                      .then(json => {
                        logger.info(
                          `3. The package name in json is: ${json.name}`
                        );
                        if (json.name === package.name) {
                          return github.repos.get({
                            owner: user,
                            repo: repo
                          });
                        } else {
                          package.error = 'missmatch';
                          return Promise.reject(
                            new Error({
                              message: 'missmatch',
                              detail:
                                'Name in npm and name in repo is a missmatch or json cannot be parsed'
                            })
                          );
                        }
                      })
                      .then(res => {
                        logger.info(
                          `${user}/${repo}: ${res.data.stargazers_count}`
                        );
                        if (
                          res.data.html_url.includes(user) &&
                          res.data.html_url.includes(repo)
                        ) {
                          package.stars = res.data.stargazers_count;
                          logger.info(
                            `4. Store package ${package.name} with ${res.data
                              .stargazers_count} GitHub stars!`
                          );
                          return Promise.resolve('Starting the analysis');
                        } else {
                          package.error = 'redirect';
                          return Promise.reject(
                            new Error({ message: 'Redirect' })
                          );
                        }
                      })
                      .then(() => {
                        mkdirp.sync('./downloads');
                        const url = package.latest_package_json.dist.tarball;
                        logger.info(`Downloading tarball from: ${url}`);
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
                                    return reject('error');
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
                        logger.info(`Starting analysis on ${package._id}`);
                        return glob(createGlobbyPattern(localPath), {
                          nodir: true
                        });
                      })
                      .then(paths => {
                        logger.info(paths);
                        logger.info(`eslint`);
                        package.eslint = cli.executeOnFiles(paths);
                        logger.info(`escomplex`);
                        const source = _.chain(paths)
                          .map(readCode)
                          .reject(['code', null])
                          .value();
                        package.escomplex = escomplex.analyse(source, {
                          ignoreErrors: true
                        });
                        logger.info(`nsp`);
                        logger.info(localPath);
                        const nspAnalysis = shell.exec(
                          `./node_modules/.bin/nsp check ${path.join(
                            localPath,
                            'package'
                          )} --reporter json`,
                          { silent: true }
                        ).stdout;
                        logger.info(nspAnalysis);
                        if (nspAnalysis) {
                          package.nsp = JSON.parse(nspAnalysis);
                        } else {
                          package.nsp = [];
                        }
                        logger.info(`Cleaning up`);
                        rimraf.sync(dest);
                        return npmpackages.getAsync(job.package_name);
                      })
                      .then(() => {
                        logger.info(`Starting analysis on ${package._id}`);
                        return glob(createGlobbyPattern(localPath), {
                          nodir: true
                        });
                      })
                      .then(paths => {
                        logger.info(paths);
                        logger.info(`eslint`);
                        package.eslint = cli.executeOnFiles(paths);
                        logger.info(`escomplex`);
                        const source = _.chain(paths)
                          .map(readCode)
                          .reject(['code', null])
                          .value();
                        package.escomplex = escomplex.analyse(source, {
                          ignoreErrors: true
                        });
                        logger.info(`nsp`);
                        logger.info(localPath);
                        const nspAnalysis = shell.exec(
                          `./node_modules/.bin/nsp check ${path.join(
                            localPath,
                            'package'
                          )} --reporter json`,
                          { silent: true }
                        ).stdout;
                        logger.info(nspAnalysis);
                        if (nspAnalysis) {
                          package.nsp = JSON.parse(nspAnalysis);
                        } else {
                          package.nsp = [];
                        }
                        logger.info(`Cleaning up`);
                        rimraf.sync(dest);
                        return npmpackages.getAsync(job.package_name);
                      })
                      .then(res => {
                        package._rev = res._rev;
                        return npmpackages.insertAsync(package);
                      })
                      .catch(err => {
                        if (err.message === 'missing') {
                          logger.info('New package added!');
                          return npmpackages.insertAsync(package);
                        } else {
                          logger.info(err);
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  } else {
                    return Promise.reject('Not able to connect to github');
                  }
                })
                .catch(err => {
                  console.error(err);
                  if (err.message == 'Not Found') {
                    package.error = 'not-found';
                    console.log('Not found in github parsed address');
                  }
                })
                .finally(() => {
                  console.log(' [x] Done');
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
        logger.info('done');
      });
    return ok;
  })
  .then(null, logger.warn);

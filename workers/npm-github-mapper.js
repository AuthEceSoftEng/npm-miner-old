'use strict'

const { CronJob } = require('cron');
const nano = require('nano')('http://localhost:5984');
const Promise = require("bluebird");
const _ = require('lodash');

var npmregistry = Promise.promisifyAll(nano.db.use('npm_registry'));
var npmstats = Promise.promisifyAll(nano.db.use('npm_stats'));

new CronJob('* * * * * *', () => {
    console.log('Once a week fetch new packages')
  }, null, true, 'Europe/Athens');

new CronJob('* * * * * *', () => {
console.log('2')
}, null, true, 'Europe/Athens');


// Each month get the number of documents and start filtering





const { CronJob } = require('cron');
const bunyan = require('bunyan');
const amqp = require('amqplib');
const Promise = require('bluebird');
const consts = require('./consts');

const logger = bunyan.createLogger({ name: 'tracker' });
const npmdb = require('nano')('http://couchdb.npm-miner.com:5986/npm-registry');
Promise.promisifyAll(npmdb);
const url =
  'amqp://localhost' ||
  process.env.CLOUDAMQP_URL ||
  'amqp://snf-782941.vm.okeanos.grnet.gr';

let myConn;
let channel;
const limit = 2000;
const last_sequence_id = 'last_sequence';
const q = 'filter';
const _ = require('lodash');

new CronJob(
  '00 00 * * * *',
  function() {
    // Get the latest change
    logger.info('It is time to track the changes');
    // Connet to rabbit
    amqp
      .connect(url)
      .then(conn => {
        myConn = conn;
        return myConn.createChannel();
      })
      .then(ch => {
        channel = ch;
        // Get the number of documents in the db
        logger.info(`Retrieving documents`);
        return npmdb.infoAsync();
      })
      .then(body => {
        let total = body.doc_count;
        let totalPages = Math.ceil(total / limit);
        logger.info(`Total documents: ${total}`);
        logger.info(`Total pages: ${totalPages}`);
        var page = _.random(1, totalPages);
        logger.info(`Page: ${page}`);
        // Fetch the changes since the last sequence
        return npmdb.listAsync({
          include_docs: true,
          limit: limit,
          skip: (page - 1) * limit
        });
      })
      .then(body => {
        return Promise.map(body.rows, doc => {
          logger.info(doc.doc.name);
          const job = {
            package_name: doc.doc.name
          };
          return Promise.all([
            channel.assertQueue(q),
            channel.sendToQueue(q, Buffer.from(JSON.stringify(job)))
          ]);
        });
      })
      .catch(err => {
        logger.error(err);
      })
      .finally(() => {
        logger.info('finally');
        if (myConn) myConn.close();
      });
    logger.info('I am done. See you in an hour!');
  },
  null,
  true,
  'Europe/Athens'
);

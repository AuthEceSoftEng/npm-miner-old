const { CronJob } = require('cron');
const bunyan = require('bunyan');
const amqp = require('amqplib');
const Promise = require('bluebird');
const consts = require('./consts');

const logger = bunyan.createLogger({ name: 'tracker' });
const npmdb = require('nano')('http://couchdb.npm-miner.com:5986/npm-registry');
Promise.promisifyAll(npmdb);
const meta = require('nano')('http://couchdb.npm-miner.com:5986/npm-meta');
Promise.promisifyAll(meta);
const url =
  'amqp://localhost' ||
  process.env.CLOUDAMQP_URL ||
  'amqp://snf-782941.vm.okeanos.grnet.gr';

let myConn;
let channel;
const limit = 1400;
const last_sequence_id = 'last_sequence';
const q = 'filter';

new CronJob(
  '00 32 * * * *',
  function() {
    let last_seq_doc;
    let last_seq;
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
        // Get the last sequence
        return meta.getAsync(last_sequence_id);
      })
      .then(body => {
        last_seq_doc = body;
        logger.info(`Last sequence checked: ${last_seq_doc.last_sequence}`);
        // Fetch the changes since the last sequence
        return npmdb.changesAsync({ limit, since: last_seq_doc.last_sequence });
      })
      .then(body => {
        last_seq = body.last_seq;
        return Promise.map(body.results, change => {
          if (change.id.charAt(0) === '_') {
            logger.info('skipping');
            return Promise.resolve('skipping');
          } else if (change.deleted) {
            logger.info(`deleting ${change.id}`);
            const job = {
              task: consts.DELETE_PACKAGE,
              package_name: change.id
            };
            return Promise.all([
              channel.assertQueue(q),
              channel.sendToQueue(q, Buffer.from(JSON.stringify(job)))
            ]);
          } else if (change.changes[0].rev.substring(0, 2) === '1-') {
            logger.info(`creating ${change.id}`);
            const job = {
              task: consts.CREATE_PACKAGE,
              package_name: change.id
            };
            return Promise.all([
              channel.assertQueue(q),
              channel.sendToQueue(q, Buffer.from(JSON.stringify(job)))
            ]);
          } else {
            const job = {
              task: consts.UPDATE_PACKAGE,
              package_name: change.id
            };
            logger.info(`updating ${change.id}`);
            return Promise.all([
              channel.assertQueue(q),
              channel.sendToQueue(q, Buffer.from(JSON.stringify(job)))
            ]);
          }
        });
      })
      .then(() => {
        logger.info('done');
        // writing last sequence
        last_seq_doc.last_sequence = last_seq;
        return meta.insertAsync(last_seq_doc);
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

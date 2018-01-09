const axios = require('axios');
const R = require('ramda');

const BASE_URL = 'http://couchdb.npm-miner.com:5984/';

const httpGet = R.curry((baseUrl, path, param) => {
  return axios.get(`${baseUrl}${path}${param}`);
});

const getCouchDbData = httpGet(BASE_URL, 'npm-packages/');

module.exports = { getCouchDbData };

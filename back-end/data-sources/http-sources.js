const axios = require('axios');
const R = require('ramda');

const COUCHDB_BASE_URL = 'http://couchdb.npm-miner.com:5984/';

const NPMIO_BASE_URL = 'http://api.npms.io/v2/';

const GITHUB_BASE_URL = 'https://api.github.com/';

const httpGet = R.curry((baseUrl, path, param) => {
  return axios.get(`${baseUrl}${path}${param}`);
});

const get = url => axios.get(url);

const getCouchDbData = httpGet(COUCHDB_BASE_URL, 'npm-packages/');

const getNpmIOData = httpGet(NPMIO_BASE_URL, `package/`);

const gitHubData = httpGet(GITHUB_BASE_URL, `repos/`);

const gitHubRepoToOwnerAndPackage = repo => {
  return repo
    .split('/')
    .slice(-2)
    .join('/');
};

module.exports = {
  getCouchDbData,
  getNpmIOData,
  gitHubData,
  gitHubRepoToOwnerAndPackage
};

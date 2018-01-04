const axios = require('axios');
const R = require('ramda');

const BASE_URL = 'http://couchdb.npm-miner.com:5984/';

const httpGet = R.curry((baseUrl, path, param) => {
  return axios.get(`${baseUrl}${path}${param}`);
});

const getMinedPackage = httpGet(BASE_URL, 'npm-packages/');

const createGraphqlResponse = couchDBResponse => {
  return couchDBResponse.then(res => {
    return {
      _id: res.data._id,
      name: res.data.name,
      github_repository: res.data.github_repository,
      stars: res.data.stars,
      testJSON: res.data.escomplex
    };
  });
};

module.exports = { getMinedPackage, createGraphqlResponse };

// {
//     _id: "express",
//     name: "express",
//     github_repository:"express-github",
//     stars: 5,
//   }

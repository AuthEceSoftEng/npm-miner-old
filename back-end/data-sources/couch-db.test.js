const getMinedPackage = require('./couch-db');
const axios = require('axios');

describe('talk to couchDB', () => {
  it('search for a package with name `express`', () => {
    return axios
      .get(`http://couchdb.npm-miner.com:5984/npm-packages/express`)
      .then(res => {
        expect(res.data._id).toBe('express');
      });
  });
});

describe('test getMinedPackage function', () => {
  it('search for a package with name `express`', () => {
    return getMinedPackage('express').then(res => {
      expect(res.data._id).toBe('express');
    });
  });
});

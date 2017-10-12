let nano = require('nano')('http://localhost:5984');
let Promise = require("bluebird");
let npm_registry = Promise.promisifyAll(nano.db.use('npm_registry'));

// Replicate if needed

// Push views

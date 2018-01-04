const { promisify } = require('util');
const shell = require('shelljs');
const R = require('ramda');

const promisedShellExec = promisify(shell.exec);

const searchNpm = packageToSearch => {
  return promisedShellExec(`npm search ${packageToSearch} --json`, {
    silent: true
  }).then(data => {
    return JSON.parse(data).map(o => {
      return { name: o.name, description: o.description };
    });
  });
};

module.exports = searchNpm;

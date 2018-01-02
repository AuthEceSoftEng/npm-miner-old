const { promisify } = require('util');
const shell = require('shelljs');
const R = require('ramda');

const promisedShellExec = promisify(shell.exec);

// really really terrible way to search npm!!!
const searchNpm = packageToSearch => {
  return promisedShellExec(`npm search ${packageToSearch}`).then(data => {
    return R.flatten(
      data
        .split('\n')
        .slice(1)
        .map(row => row.replace(/\s/g, '').split('|'))
        .map(row => row.slice(0, 1))
        .slice(0, -1)
    );
  });
};

module.exports = searchNpm;

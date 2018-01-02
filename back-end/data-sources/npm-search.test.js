const npmSearch = require('./npm-search');

describe('npm-search', () => {
  it('search for a package with name `test`', () => {
    const expected = [
      {
        description:
          'Reruns the given file whenever a file in the current working dir subtree is changed.',
        name: 'run'
      }
    ];
    return npmSearch('run').then(data => {
      expect(data).toEqual(expect.arrayContaining(expected));
    });
  });
});

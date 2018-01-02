const npmSearch = require('./npm-search');

describe('npm-search', () => {
  it('search for a package with name `test`', () => {
    const expected = ['run'];
    return npmSearch('run').then(data => {
      expect(data).toEqual(expect.arrayContaining(expected));
    });
  });
});

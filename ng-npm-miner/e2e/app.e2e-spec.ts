import { NgNpmMinerPage } from './app.po';

describe('ng-npm-miner App', () => {
  let page: NgNpmMinerPage;

  beforeEach(() => {
    page = new NgNpmMinerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

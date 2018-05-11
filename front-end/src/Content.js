import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Main from './Main';
import Search from './Search';
import PackageDetails from './PackageDetails/PackageDetails';
import withTracker from './withTracker';

class Content extends Component {
  render() {
    return (
      <div className='Site-content'>
        <Route exact path="/" component={withTracker(Main)} />
        <Route exact path="/search" component={withTracker(Search)} />
        <Route exact path="/about" component={withTracker(About)} />
        <Route exact path="/package/:packagename" component={withTracker(PackageDetails)} />
      </div>
    );
  }
}

export default Content;

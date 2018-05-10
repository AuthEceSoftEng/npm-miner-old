import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Main from './Main';
import Search from './Search';
import PackageDetails from './PackageDetails/PackageDetails';

class Content extends Component {
  render() {
    return (
      <div className='Site-content'>
        <Route exact path="/" render={() => <Main />} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/about" component={About} />
        <Route exact path="/package/:packagename" component={PackageDetails} />
      </div>
    );
  }
}

export default Content;

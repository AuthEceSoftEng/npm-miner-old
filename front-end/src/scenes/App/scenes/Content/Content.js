import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import About from './scenes/About/About';
import Playground from './scenes/Playground/Playground';
import Main from './scenes/Main/Main';
import PackageDetails from '../PackageDetails/PackageDetails';
import styles from './content.module.css';

class Content extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Route exact path="/" render={() => <Main />} />
        <Route exact path="/playground" component={Playground} />
        <Route exact path="/about" component={About} />
        <Route exact path="/package/:packagename" component={PackageDetails} />
      </div>
    );
  }
}

export default Content;

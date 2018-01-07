import React, { Component } from 'react';
import styles from './main.module.css';

class Main extends Component {
  placeholder = 'Search for a package';
  foundPackages = [];
  foundPackages2 = [
    'express',
    'react',
    'angular',
    'graphql',
    'apollo',
    'bootstrap',
    'next'
  ];
  name = '';
  handleChange = event => {
    if (event.target.value) {
      this.foundPackages.concat('fdf');
    }

    console.log(event.target.value);
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.intro}>
          <h4>
            Npm-Miner combines results from popular static analysis tools in
            order to provide insights about the software quality on the {' '}
            <a href="https://www.npmjs.com/">npm</a> ecosystem
          </h4>
        </div>
        <div className={styles.search}>
          <div>
            <input
              type="text"
              name="searchTerm"
              placeholder={this.placeholder}
              onChange={e => this.handleChange(e)}
            />
            <div className={styles.searchResults}>
              <ul>{this.foundPackages.map(pack => <li>{pack}</li>)}</ul>
            </div>
          </div>
        </div>
        <div className={styles.statistics}>
          <h2>Test</h2>
          <h2>Main</h2>
          <h2>Main</h2>
          <h2>Main</h2>
        </div>
      </div>
    );
  }
}

export default Main;

import React, { Component } from 'react';
import styles from './main.module.css';
import { RingLoader } from 'halogenium';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import take from 'ramda/src/take';
import { SearchService } from '../../../../../../services/searchService';

const frontPageQuery = gql`
  {
    frontPageStats {
      loc
      numOfPackages
      topTenStars
    }
  }
`;

class Main extends Component {
  state = {
    foundPackages: [],
    searchBoxFocued: false
  };
  searchService = new SearchService();
  placeholder = 'Search for a package';
  searchResults$ = this.searchService.getResults();

  componentDidMount() {
    this.searchResults$.subscribe(data => {
      this.setFoundPackages(data);
    });
  }

  componentWillUnmount() {
    this.searchResults$.unsubscribe();
  }

  handleChange = event => {
    this.searchService.search({ value: event.target.value.trim() });
  };

  handleFocus = event => {
    this.setState(state => {
      return {
        ...state,
        searchBoxFocued: true
      };
    });
  };

  handleBlur = event => {
    this.setState(state => {
      return {
        ...state,
        searchBoxFocued: false
      };
    });
  };

  setFoundPackages = data => {
    this.setState(state => {
      return {
        ...state,
        foundPackages: take(5, data)
      };
    });
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
              placeholder={this.placeholder}
              onChange={e => this.handleChange(e)}
              onFocus={e => this.handleFocus(e)}
              onBlur={e => this.handleBlur(e)}
            />
            {this.state.searchBoxFocued &&
            this.state.foundPackages.length > 0 ? (
              <div className={styles.searchResults}>
                <ul>
                  {this.state.foundPackages.map(pack => (
                    <li key={pack.name}>
                      <h3>{pack.name}</h3>
                      <p>{pack.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
        <div className={styles.statistics}>
          <div className={styles.statisticsBox}>
            <h2>Top 10 Packages</h2>
            {!this.props.data.loading ? (
              <table>
                <tbody>
                  {this.props.data.frontPageStats.topTenStars.map(v => {
                    return (
                      <tr className={styles.topTenStars} key={v.id}>
                        <td>{v.value}</td>
                        <td>{v.key} stars</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <RingLoader color="#512d5a" size="32px" margin="4px" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const MainWithData = graphql(frontPageQuery)(Main);

export default MainWithData;

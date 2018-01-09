import React, { Component } from 'react';
import styles from './main.module.css';
import { RingLoader } from 'halogenium';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
  placeholder = 'Search for a package';

  foundPackages2 = [
    { name: 'express', description: 'Lorem Ipsum' },
    { name: 'react', description: 'Lorem Ipsum' },
    { name: 'angular', description: 'Lorem Ipsum' },
    { name: 'graphql', description: 'Lorem Ipsum' },
    { name: 'apollo', description: 'Lorem Ipsum' },
    { name: 'next', description: 'Lorem Ipsum' }
  ];
  name = '';
  handleChange = event => {
    console.log(event);

    if (event.target.value !== '') {
      this.setState(state => {
        return {
          ...state,
          foundPackages: this.foundPackages2
        };
      });
    } else {
      this.setState(state => {
        return {
          ...state,
          foundPackages: []
        };
      });
    }

    console.log(event.target.value);
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

  render() {
    console.log(this.props.data);
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
              onFocus={e => this.handleFocus(e)}
              onBlur={e => this.handleBlur(e)}
            />
            {this.state.searchBoxFocued &&
            this.state.foundPackages.length > 0 ? (
              <div className={styles.searchResults}>
                <ul>
                  {this.state.foundPackages.map(pack => (
                    <li>
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

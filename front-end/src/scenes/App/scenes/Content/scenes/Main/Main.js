import React, { Component } from 'react';
import styles from './main.module.css';
import { RingLoader } from 'halogenium';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Search from './Search';

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
        <Search />
        <div className={styles.statistics}>
          <div className={styles.statisticsBox}>
            <h2>Top 10 Packages</h2>
            {!this.props.data.loading ? (
              <table>
                <tbody>
                  {this.props.data.frontPageStats.topTenStars.map(v => {
                    return (
                      <tr className={styles.topTenStars} key={v.id}>
                        <td>{v.value[0]}</td>
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

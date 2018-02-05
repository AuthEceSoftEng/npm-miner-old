import React from 'react';
import styles from './package.module.css';
import { RingLoader } from 'halogenium';
import MinedInfo from './MinedInfo';
import NpmsioInfo from './NpmsioInfo';
import GithubInfo from './GithubInfo';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const packageDetailes = gql`
  query currentPackageDetails($packageName: String!) {
    minedPackageInfo(name: $packageName) {
      github_repository
      stars
      numOfFiles
      minDirDepth
      maxDirDepth
      sumDirDepth
      eslint
      escomplex
      nsp
      gitHubRepo {
        data
      }
    }
    npmsIoPackage(name: $packageName) {
      data
    }
  }
`;

class PackageDetails extends React.Component {
  render() {
    console.log(this.props.data);
    return (
      <div className={styles.container}>
        <div className={styles.npmio}>
          <div className={styles.statisticsBox}>
            <h2>npms.io</h2>
            {!this.props.data.loading ? (
              <NpmsioInfo npmsIoPackage={this.props.data.npmsIoPackage.data} />
            ) : (
              <RingLoader color="#512d5a" size="32px" margin="4px" />
            )}
          </div>
        </div>
        <div className={styles.statistics}>
          <div className={styles.statisticsBox}>
            <h2>npm-miner data</h2>
            {!this.props.data.loading ? (
              <MinedInfo minedPackageInfo={this.props.data.minedPackageInfo} />
            ) : (
              <RingLoader color="#512d5a" size="32px" margin="4px" />
            )}
          </div>
        </div>
        <div className={styles.github}>
          <div className={styles.statisticsBox}>
            <h2>github</h2>
            {!this.props.data.loading ? (
              <GithubInfo
                githubInfo={this.props.data.minedPackageInfo.gitHubRepo.data}
              />
            ) : (
              <RingLoader color="#512d5a" size="32px" margin="4px" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const PackageDetailsWithData = graphql(packageDetailes, {
  options: ({ match }) => ({
    variables: { packageName: match.params.packagename }
  })
})(PackageDetails);

export default PackageDetailsWithData;

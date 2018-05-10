import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import MinedInfo from './MinedInfo';
import NpmsioInfo from './NpmsioInfo';
import GitHubInfo from './GitHubInfo';
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

class PackageDetails extends Component {
  render() {
    return (
        <section className="section">
            <div className="container">
              {!this.props.data.loading ? (
                <div className='columns'>  
                  <div className='column'>
                    <NpmsioInfo npmsIoPackage={this.props.data.npmsIoPackage.data} />
                  </div>
                  <div className='column'>
                  <MinedInfo minedPackageInfo={this.props.data.minedPackageInfo} />
                  </div>
                  <div className='column'>
                    <GitHubInfo githubInfo={this.props.data.minedPackageInfo.gitHubRepo.data} />
                  </div>
                </div>
                ) : (
                  <div className='has-text-centered'>
                    <BeatLoader color="black" />
                  </div>
                )}
            </div>
        </section>
    )}
}

const PackageDetailsWithData = graphql(packageDetailes, {
    options: ({ match }) => ({
      variables: { packageName: match.params.packagename }
    })
  })(PackageDetails);
  
  export default PackageDetailsWithData;

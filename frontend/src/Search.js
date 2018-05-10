import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import queryString from 'query-string'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BeatLoader } from 'react-spinners';

const query = gql`
    query searchedPackages($name: String!) {
        npmPackages(name: $name) {
        name
        description
        }
    }
`;


class Search extends Component {

    render() {
        return (
            <section className="section">
                <div className="container">
                    {!this.props.data.loading ? (
                        <ul>
                            {this.props.data.npmPackages.map(v => {
                                return (
                                <li key={v.name}>
                                    <Link to={`/package/${v.name}`}><span>{v.name}</span></Link>
                                    <span> - </span>
                                    <span>{v.description}</span>
                                </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className='has-text-centered'>
                            <BeatLoader
                                color={'black'} 
                            />
                        </div>
                    )}
                </div>
            </section>
        )
    }
}

const SearchWithData = graphql(query, {
  options: ({ location }) => ({
    variables: { name: queryString.parse(location.search).q }
  })
})(Search);

export default SearchWithData;

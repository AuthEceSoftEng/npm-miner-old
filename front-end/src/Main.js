import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BeatLoader } from 'react-spinners';
import './Main.css'
import PropTypes from 'prop-types';

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

    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        const path = `/search?q=${this.state.value}`;
        this.context.router.history.push(path)
    }

    render() {
        return (
            <div>
                <section className="hero">
                    <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title">
                        Welcome to npm-miner!
                        </h1>
                        <h2 className="subtitle">
                        npm-miner aggregates the results of 
                        popular static analysis tools in order 
                        to provide insights about the software 
                        quality on the npm ecosystem.
                        </h2>
                    </div>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="columns">
                        <div className="column is-1">
                        </div>
                        <div className="column">
                            <form onSubmit={this.handleSubmit}>
                                <div className="field has-addons">
                                    <div className="control is-expanded">
                                        <input 
                                            className="input is-rounded" 
                                            type="text" 
                                            placeholder="Search for a package" 
                                            value={this.state.value} 
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="control">
                                        <input 
                                            type='submit' 
                                            className="button is-black is-rounded"
                                            value='Search'
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="column is-1">
                        </div>
                        </div>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="columns">
                            <div className="column">
                            </div>
                            <div className="column">
                                <div className="card">
                                    <header className="card-header">
                                        <p className="card-header-title">
                                        Top 10 Starred GitHub Repos
                                        </p>
                                    </header>
                                    <div className="card-content is-paddingless">
                                        <div className="content is-size-7 p-5">
                                            {!this.props.data.loading ? (
                                                <ol>
                                                    {this.props.data.frontPageStats.topTenStars.map(v => {
                                                        return (
                                                        <li key={v.id}>
                                                            <span>{v.value[0]}</span>
                                                            <span className='is-pulled-right'>{v.key}</span>
                                                        </li>
                                                        );
                                                    })}
                                                </ol>
                                            ) : (
                                                <div className='has-text-centered'>
                                                    <BeatLoader
                                                        color={'black'} 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

// ask for `router` from context
Main.contextTypes = {
    router: PropTypes.object
};


const MainWithData = graphql(frontPageQuery)(Main);

export default MainWithData;

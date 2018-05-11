import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './Header'
import Footer from './Footer'
import Content from './Content'

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_SERVER_ADDRESS
  }),
  cache: new InMemoryCache()
});

class App extends Component {

  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <div className="Site">
            <Header siteTile='npm-miner' />
            <Content />
            <Footer />
          </div>
        </ApolloProvider>
      </Router>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './scenes/Header/Header';
import Footer from './scenes/Footer/Footer';
import Content from './scenes/Content/Content';

import styles from './app.module.css';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_SERVER_ADRESS
  }),
  cache: new InMemoryCache()
});

class App extends Component {
  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <div className={styles.container}>
            <div className={styles.header}>
              <Header />
            </div>
            <div className={styles.content}>
              <Content />
            </div>
            <div className={styles.footer}>
              <Footer />
            </div>
          </div>
        </ApolloProvider>
      </Router>
    );
  }
}

export default App;

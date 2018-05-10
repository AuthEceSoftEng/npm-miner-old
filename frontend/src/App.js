import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import {Helmet} from "react-helmet";

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
          {process.env.NODE_ENV === 'production' ?
            <Helmet>
              <script async src="https://www.googletagmanager.com/gtag/js?id=UA-17339437-5"></script>
              <script>{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'UA-17339437-5');
                `}
              </script>
            </Helmet> : null}
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

import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './scenes/Header/Header';
import Footer from './scenes/Footer/Footer';
import Content from './scenes/Content/Content';
import styled, { ThemeProvider } from 'styled-components';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import theme from './theme';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cj3a6d6i0a2s30130n9d0jy6d'
  }),
  cache: new InMemoryCache()
});

const Main = styled.div`
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-between;
  font-family: 'Oxygen', sans-serif;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      theme,
      analyzedPackage: {}
    };
  }
  setAnalyzedPackage = foundPackage => {
    this.setState({ analyzedPackage: foundPackage });
  };

  componentWillMount() {
    console.log('Test');
    client
      .query({
        query: gql`
          {
            allPackages {
              name
            }
          }
        `
      })
      .then(res => {
        console.log(res.data);
      });
  }

  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <ThemeProvider theme={this.state.theme}>
            <div>
              <Main>
                <Header />
                <Content
                  setAnalyzedPackage={this.setAnalyzedPackage}
                  analyzedPackage={this.state.analyzedPackage}
                />
                <Footer />
              </Main>
            </div>
          </ThemeProvider>
        </ApolloProvider>
      </Router>
    );
  }
}

export default App;

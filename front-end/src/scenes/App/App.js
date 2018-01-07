import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// import Header from './scenes/Header/Header';
// import Footer from './scenes/Footer/Footer';
// import Content from './scenes/Content/Content';

import styles from './app.module.css';
// import mainGrid from './main-grid.module.css';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import theme from './theme';

console.log(styles);
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql'
  }),
  cache: new InMemoryCache()
});

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
    client
      .query({
        query: gql`
          {
            ping
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
          <div className={styles.container}>
            <div className={styles.header}>HEADER</div>
            <div className={styles.menu}>MENU</div>
            <div className={styles.content}>CONTENT</div>
            <div className={styles.footer}>FOOTER</div>
          </div>
        </ApolloProvider>
      </Router>
    );
  }

  // render() {
  //   return (
  //     <Router>
  //       <ApolloProvider client={client}>
  //         <ThemeProvider theme={this.state.theme}>
  //           <div>
  //             <Main>
  //               <Header />
  //               <Content
  //                 setAnalyzedPackage={this.setAnalyzedPackage}
  //                 analyzedPackage={this.state.analyzedPackage}
  //               />
  //               <Footer />
  //             </Main>
  //           </div>
  //         </ThemeProvider>
  //       </ApolloProvider>
  //     </Router>
  //   );
  // }
}

export default App;

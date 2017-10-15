import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import styled, { ThemeProvider } from 'styled-components';
import theme from './theme';

const Main = styled.div`
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-between;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
      theme: theme
    };
  }
  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <div>
          <Main>
            <Header />
            <Content />
            <Footer />
          </Main>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;

import React, { Component } from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom'
import Header from './scenes/Header/Header';
import Footer from './scenes/Footer/Footer';
import Content from './scenes/Content/Content';
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
  font-family: 'Oxygen', sans-serif;
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
      <Router>
        <ThemeProvider theme={this.state.theme}>
          <div>
            <Main>
              <Header />
              <Content />
              <Footer />
            </Main>
          </div>
        </ThemeProvider>
      </Router>
    );
  }
}

export default App;

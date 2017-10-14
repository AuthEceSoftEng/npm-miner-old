import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import Content from './Content'
import styled from 'styled-components';


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
  render() {
    return (
      <Main>
        <Header />
        <Content />
        <Footer />
      </Main>
    );
  }
}

export default App;

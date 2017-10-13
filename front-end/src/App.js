import React, { Component } from 'react';
import Header from './Header';
import Content from './Content'
import styled from 'styled-components';


const Main = styled.div`
  // font-size: 1.5em;
  // text-align: center;
  // color: salmon;
  // height: 100vh;
  // display: flex;
  // flex-direction: column;
  // flex-wrap: nowrap;
  // align-content: center;
  // justify-content: space-between;
`;




class App extends Component {
  render() {
    return (
      <Main>
        <Header />
        <Content />
        <Header />
      </Main>
    );
  }
}

export default App;

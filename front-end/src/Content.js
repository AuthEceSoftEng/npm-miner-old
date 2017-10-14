import React, { Component } from 'react';
import styled from 'styled-components';
import theme from './theme'

const Main = styled.div`
  color: ${theme.colors.typography};
  // border-style: solid;
  // border-width: 4px;
  // border-color: red;
  flex: 1 0 auto;
`;

class Content extends Component {
  render() {
    return (
      <Main>
        <h1>Hell0</h1>
        <ul>
          {Array.apply(0, Array(25)).map(function(x, i) {
            return <li>{i}</li>
          })}
        </ul>
      </Main>
    );
  }
}

export default Content;

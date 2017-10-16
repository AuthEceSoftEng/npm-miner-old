import React, { Component } from 'react';
import styled from 'styled-components';
import theme from './theme';

const MainStyle = styled.div`
  color: ${theme.colors.typography_dark};
  // border-style: solid;
  // border-width: 4px;
  // border-color: red;
`;

class Main extends Component {
  render() {
    return (
      <MainStyle>
        <h2>Main</h2>
      </MainStyle>
    );
  }
}
export default Main;

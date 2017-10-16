import React, { Component } from 'react';
import styled from 'styled-components';
import theme from './theme';

const PlaygroundStyle = styled.div`
  color: ${theme.colors.typography_dark};
  // border-style: solid;
  // border-width: 4px;
  // border-color: red;
`;

class Playground extends Component {
  render() {
    return (
      <PlaygroundStyle>
        <h2>Playground</h2>
      </PlaygroundStyle>
    );
  }
}
export default Playground;

import React, { Component } from 'react';
import styled from 'styled-components';
import theme from '../../../../theme';

const PlaygroundStyle = styled.div`
  color: ${theme.colors.typography_dark};
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

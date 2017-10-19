import React, { Component } from 'react';
import styled from 'styled-components';

const PlaygroundStyle = styled.div`
  color: ${props => props.theme.colors.typography_dark};
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

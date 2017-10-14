import React, { Component } from 'react';
import styled from 'styled-components';

const Lol = styled.div`
  color: #00ff00;
  border-style: solid;
  border-width: 4px;
  border-color: red;
  height: 100vh;

`;

class Content extends Component {
  render() {
    return (
      <Lol>
        <p>Hell</p>
      </Lol>
    );
  }
}

export default Content;

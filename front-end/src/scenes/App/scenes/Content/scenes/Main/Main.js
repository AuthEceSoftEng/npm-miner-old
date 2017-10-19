import React, { Component } from 'react';
import styled from 'styled-components';


const MainStyle = styled.div`
  color: ${props => props.theme.colors.typography_dark};
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

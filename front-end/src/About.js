import React, { Component } from 'react';
import styled from 'styled-components';
import theme from './theme';

const AboutStyle = styled.div`
  color: ${theme.colors.typography_dark};
  // border-style: solid;
  // border-width: 4px;
  // border-color: red;
`;

class About extends Component {
  render() {
    return (
      <AboutStyle>
        <h2>About</h2>
      </AboutStyle>
    );
  }
}
export default About;

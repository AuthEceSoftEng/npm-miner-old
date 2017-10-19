import React, { Component } from 'react';
import styled from 'styled-components';


const AboutStyle = styled.div`
  color: ${props => props.theme.colors.typography_dark};
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

import React, { Component } from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.typography}
`;

class Footer extends Component {
  render() {
    return (
      <FooterWrapper>
        <h2>Footer Placeholder</h2>
      </FooterWrapper>
    );
  }
}
export default Footer;

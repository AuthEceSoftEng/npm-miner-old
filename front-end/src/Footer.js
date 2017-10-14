import React, { Component } from 'react';
import styled from 'styled-components';
import theme from './theme'

const FooterWrapper = styled.div`
  background: ${theme.colors.primary};
  color: white;
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

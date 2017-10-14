import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';
// import logo from './logo.svg';

const HeaderWrapper = styled.div`
  .navbar,
  .navbar-default {
    background: mediumseagreen;
  }
  .navbar-header {
  }
  a.navbar-brand {
    color: #ffffff;
    font-weight: 900;
  }

  .navbar-default .navbar-nav > li > a {
    color: #ffffff;
  }
`;

class Header extends Component {
  render() {
    return (
      <HeaderWrapper>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Npm-Miner</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">
              PlayGround
            </NavItem>
            <NavItem eventKey={2} href="#">
              About
            </NavItem>
          </Nav>
        </Navbar>
      </HeaderWrapper>
    );
  }
}
export default Header;

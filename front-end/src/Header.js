import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import logo from './logo.svg';
import theme from './theme'

const HeaderWrapper = styled.div`
  .navbar,
  .navbar-default {
    background: ${theme.colors.primary};
    font-size: 1.5em;
  }
  .navbar-brand {
    display: flex;
    align-items: center;
  }
  .navbar-brand > img {
    padding: 7px 14px;
  }
  .navbar-brand > a {
    color: #ffffff;
    font-weight: 900;
  }

  .navbar-default .navbar-toggle .icon-bar {
    background-color: #ffffff;
  }

  .navbar-default .navbar-toggle:hover,
  .navbar-default .navbar-toggle:focus {
    background-color: mediumpurple;
    box-shadow: 2px 2px 5px grey;
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
              <img src={logo} alt="" width="72" height="72" />
              <a>Npm-Miner</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem>PlayGround</NavItem>
              <NavItem>About</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </HeaderWrapper>
    );
  }
}
export default Header;

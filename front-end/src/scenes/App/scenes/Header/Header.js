import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import logo from './logo.svg';
import { Link } from 'react-router-dom';

const HeaderWrapper = styled.div`
  .navbar,
  .navbar-default {
    background: ${props => props.theme.colors.primary};
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
    color: ${props => props.theme.colors.typography};
    font-weight: 900;
  }

  .navbar-default .navbar-toggle .icon-bar {
    background-color: ${props => props.theme.colors.typography};
  }

  .navbar-default .navbar-toggle:hover,
  .navbar-default .navbar-toggle:focus {
    background-color: mediumpurple;
    box-shadow: 2px 2px 5px grey;
  }

  .navbar-default .navbar-nav > li > a > a {
    color: ${props => props.theme.colors.typography};
  }
`;

class Header extends Component {
  render() {
    return (
      <HeaderWrapper>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">
                <img src={logo} alt="" width="72" height="72" />
                <a>Npm-Miner</a>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem>
                <Link to="/playground">PlayGround</Link>
              </NavItem>
              <NavItem>
                <Link to="/about">About</Link>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </HeaderWrapper>
    );
  }
}
export default Header;

import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import logo from './logo.svg';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

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

  .navbar-default .navbar-brand:hover,
  .navbar-default .navbar-brand:focus,
  a.navbar-brand {
    color: ${props => props.theme.colors.typography};
    font-weight: 900;
  }

  .navbar-default .navbar-toggle:hover,
  .navbar-default .navbar-toggle:focus {
    background-color: mediumpurple;
    box-shadow: 2px 2px 5px grey;
  }

  .navbar-default .navbar-nav > .active > a,
  .navbar-default .navbar-nav > .active > a:focus,
  .navbar-default .navbar-nav > li > a {
    color: ${props => props.theme.colors.typography};
    background-color: ${props => props.theme.colors.primary};
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
                Npm-Miner
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to="/playground">
                <NavItem eventKey={1}>PlayGround</NavItem>
              </LinkContainer>
              <LinkContainer to="/about">
                <NavItem eventKey={2}>About</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </HeaderWrapper>
    );
  }
}
export default Header;

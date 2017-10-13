import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';
// import logo from './logo.svg';

const HeaderWrapper = styled.div`
  // margin: 10, 10, 10, 10;
  // background: #c6c6c6;
`;

class Header extends Component {
  render() {
    return (
      <HeaderWrapper>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Npm-Miner</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav  pullRight bsStyle="pills">
            <NavItem eventKey={1} href="#">
              Link
            </NavItem>
            <NavItem eventKey={2} href="#">
              Link
            </NavItem>
          </Nav>
        </Navbar>
      </HeaderWrapper>
    );
  }
}
export default Header;

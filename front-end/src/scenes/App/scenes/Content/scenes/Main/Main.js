import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';

const MainStyle = styled.div`
  color: ${props => props.theme.colors.typography_dark};
  border-color: black;
  border-style: solid;
  border-width: 2px;
  margin: 10px 20% 10px 20%;

  a {
    color: ${props => props.theme.colors.primary};
  }

  .header {
    margin: 10px 15% 10px 15%;
    // width: 80%;
    text-align: center;
  }

  .narrow {
    margin: 10px 15px 10px 15px;
    width: 80%;
    text-align: center;
  }
`;

class Main extends Component {
  render() {
    return (
      <MainStyle>
        <div className="header">
          <h4>
            npm-miner combines results from popular static analysis tools in
            order to provide insights about the software quality on the {' '}
            <a href="https://www.npmjs.com/">npm</a> ecosystem
          </h4>
        </div>
        <FormControl
          bsClass="narrow"
          bsSize="large"
          type="text"
          placeholder="Search for a package"
          onChange={this.handleChange}
        />
        <h2>Main</h2>
        <h2>Main</h2>
        <h2>Main</h2>
        <h2>Main</h2>
      </MainStyle>
    );
  }

  handleChange = a => {
    console.log(a.target.value);
  };
}
export default Main;

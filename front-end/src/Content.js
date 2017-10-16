import React, { Component } from 'react';
import styled from 'styled-components';
import theme from './theme';
import { Route} from 'react-router-dom';
import About from './About';
import Playground from './Playground';
import Main from './Main';

const ContentStyle = styled.div`
  color: ${theme.colors.typography};
  // border-style: solid;
  // border-width: 4px;
  // border-color: red;
  flex: 1 0 auto;
`;

class Content extends Component {
  render() {
    return (
      <ContentStyle>
        <Route exact path="/" component={Main} />
        <Route exact path="/playground" component={Playground} />
        <Route exact path="/about" component={About} />
      </ContentStyle>
    );
  }
}

export default Content;

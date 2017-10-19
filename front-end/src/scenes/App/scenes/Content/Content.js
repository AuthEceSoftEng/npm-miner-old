import React, { Component } from 'react';
import styled from 'styled-components';
import { Route} from 'react-router-dom';
import About from './scenes/About/About';
import Playground from './scenes/Playground/Playground';
import Main from './scenes/Main/Main';


const ContentStyle = styled.div`
  color: ${props => props.theme.colors.typography};
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

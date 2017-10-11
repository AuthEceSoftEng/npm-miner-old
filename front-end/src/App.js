import React, { Component } from 'react';
import Header from './Header';
import Grid from 'material-ui/Grid';

class App extends Component {
  render() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        align="center"
      >
        <Grid item>
          <Header />
        </Grid>
        <Grid item>

        </Grid>
        <Grid item>

        </Grid>
        <Grid item>
          <h1>Test</h1>
        </Grid>
        <Grid item>
          <h1>Test</h1>
        </Grid>
      </Grid>
    );
  }
}

export default App;

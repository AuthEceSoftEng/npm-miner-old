import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import logo from './logo.svg';

class Header extends Component {
  render() {
    return (
      <AppBar position="fixed">
        <Toolbar>
          <Grid
            container
            direction="row"
            align="baseline"
            justify="space-between"
            wrap = "no-wrap"
            spacing = {24}
          >
            <Grid item xs={2} >
              <img src={logo} className="App-logo" alt="logo" height="42" width="42"/>
            </Grid>
            <Grid item xs={4}>
              <Typography type="title" color="inherit">
                Npm-Miner
              </Typography>
            </Grid>
            <Grid item xs={3} hidden >
            </Grid>
            <Grid item xs={3}>
              <Button color="contrast">Login</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}
export default Header;

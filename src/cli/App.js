import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Datasets from './scenes/datasets';

export default class extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="DARLing"/>
              <Link to="/">
                <FlatButton label="Datasets" />
              </Link>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarSeparator/>
              <RaisedButton label="Rank a dataset" primary={true} />
            </ToolbarGroup>
          </Toolbar>

          <Route exact path="/" component={Datasets} />
        </MuiThemeProvider>
      </Router>
    );
  }
}

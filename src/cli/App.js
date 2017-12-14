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
import { css } from 'react-emotion';

const contentStyle = css`
  width: 80%;
  margin: 0 auto;
  padding: 1rem .6rem;
`;

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
          <div className={contentStyle}>
            <Route exact path="/" component={Datasets} />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

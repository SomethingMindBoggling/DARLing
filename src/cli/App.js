import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

export default class extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="DARLing"/>
            <FlatButton label="Datasets" />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarSeparator/>
            <RaisedButton label="Rank a dataset" primary={true} />
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
    );
  }
}

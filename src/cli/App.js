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
import SingleDataset from './scenes/single-dataset';
import Upload from './scenes/upload';
import { css } from 'react-emotion';

const wrapperStyle = css`
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
`;

const toolbarStyle = css`
  flex: 0 auto;
`;

const contentStyle = css`
  padding: 1rem;
  flex: 1;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  width: calc(100% - 2rem);
`;

export default class extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider>
          <div className={wrapperStyle}>
            <Toolbar className={toolbarStyle}>
              <ToolbarGroup>
                <ToolbarTitle text="DARLing"/>
                <Link to="/">
                  <FlatButton label="Datasets" />
                </Link>
              </ToolbarGroup>
              <ToolbarGroup>
                <FlatButton label="Help" />
                <ToolbarSeparator/>
                <Link to="/upload">
                  <RaisedButton label="Rank a dataset" primary={true} />
                </Link>
              </ToolbarGroup>
            </Toolbar>
            <div className={contentStyle}>
              <Route exact path="/" component={Datasets} />
              <Route path="/dataset/:datasetId" component={SingleDataset} />
              <Route exact path="/upload" component={Upload} />
            </div>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

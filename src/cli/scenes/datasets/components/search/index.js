import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { css } from 'react-emotion';

const wrapperStyle = css`
  width: 100%;
`;

const textFieldStyle = css`
  width: 100% !important;
`;

export default class extends Component {
  render() {
    return (
      <div className={wrapperStyle}>
        <TextField
          className={textFieldStyle}
          hintText="Find a dataset"
        />
      </div>
    );
  }
}

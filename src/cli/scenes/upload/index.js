import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import { css } from 'react-emotion';
import { grey400, cyan700 } from 'material-ui/styles/colors';
import spaceship from './spaceship.svg';

const fileButtonStyle = css`
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    opacity: 0;
`;

const wrapperStyle = css`
  align-self: center;
  width: 100%;
  border: 1px solid ${grey400};
  border-radius: .2rem;
  padding: 2rem;
  width: 100%;
  text-align: center;
  background-color: ${cyan700};
  color: white;
`;

const buttonStyle = css`
  margin: 0 auto;
`;

const imgStyle = css`
  display: block;
  padding-bottom: 1.6rem;
  margin: 0 auto;
`;

export default class extends Component {
  render() {
    return (
      <div className={wrapperStyle}>
        <img src={spaceship} className={imgStyle} />
        <RaisedButton
          label="Choose a dataset"
          containerElement="label"
          icon={<FileUpload />}
          className={buttonStyle}
        >
          <input type="file" className={fileButtonStyle} />
        </RaisedButton>
        <p>Upload a .csv file.</p>
      </div>
    );
  }
}

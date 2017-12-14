import React, { Component } from 'react';
import Search from './components/search';
import Preview from './components/preview';
import { css } from 'react-emotion';

const previewWrapperStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
`;

const previewChildStyle = css`
  justify-self: stretch;
`;

export default class extends Component {
  render() {
    return (
      <div>
        <Search/>
        <div className={previewWrapperStyle}>
          <Preview classname={previewChildStyle} />
          <Preview classname={previewChildStyle} />
          <Preview classname={previewChildStyle} />
          <Preview classname={previewChildStyle} />
        </div>
      </div>
    );
  }
}

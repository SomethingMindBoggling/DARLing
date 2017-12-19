import React, { Component } from 'react';

export default class extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>{match.params.datasetId}</div>
    )
  }
}

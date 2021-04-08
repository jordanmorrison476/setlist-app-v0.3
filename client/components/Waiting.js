import React, { Component } from 'react';
import { connect }      from 'react-redux';

class Waiting extends Component {
  /** Render the user's info */
  render() {
    return (
      <div className="waiting">

      <div className="NewSession">
       <h1>WAITING SCREEN!</h1>
      </div>

      </div>
    );
  }
  }

export default connect(state => state)(Waiting);

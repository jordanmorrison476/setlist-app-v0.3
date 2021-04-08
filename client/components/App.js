import React, { Component } from 'react';
import  io  from 'socket.io-client';

/**
 * Main app component
 * Has a header and then render's the page content
 */
var socket;
// var host;
// var sesh;
var data2;
export default class SetlistApp extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null // <-- add this line
    }
    
    socket = io();
  }
  render() {
    // injected via react router
    const {children} = this.props;
    return (
        <div className="page-content">
          {children}
        </div>
    );
  }
}
export { socket };
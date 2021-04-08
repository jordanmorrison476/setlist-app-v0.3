import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect }      from 'react-redux';
import { socket } from './App';
import setlistLogo from '../logo.svg';
import accountIcon from '../accountIcon.svg';
//import joinSessionIcon from '../joinSessionIcon.svg';
import cancelIcon from '../cancel.svg';
import triangleIcon from '../triangle.svg';
import scanQrCode from '../qr-code-scan.svg';


Modal.setAppElement('#root');

const h3Style = {
  padding: '20px',
};

const customStyles = {
  content : {
    top                   : '20%',
    left                  : '19%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-30%, -50%)',
    height                : '190px',
    width                 : '187px',
  }
};


class Session extends Component {
  /** Render the user's info */
  constructor(props){
    super(props);
    this.changeBG = this.changeBG.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
     showModal: false
   };

  }

  componentDidMount(){
    socket.emit('login');
    var uid = this.props.location.query.UID;
    localStorage.setItem('uid', uid);
    // var loggedIn = localStorage.getItem('loggedIn');
    // if(loggedIn == null){
    //   alert('loggedin is null');
    //   // window.location.href = '/#/'
    // }
  }


   handleClick(e) {

     mixpanel.track(
     "Session Created"
     );

   }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  handleClick(){
    var uid = this.props.location.query.UID;
    window.location.href = '/getSessionId' + '?UID='+ uid;
  }

  changeBG(){
    console.log("Change Background!");
    $('.config-setlist').css("background", "#282C34");
  }

  handleLogout(){
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('uid');
    window.location.href = '/#/'
  }
  render() {

    return (
      <div className="session d-flex flex-wrap justify-content-center position-absolute w-100 h-100 align-items-center align-content-center">

      <div className="center-block text-center" >

      <div className="header">

        <div className="account-component">
        <a onClick={this.handleOpenModal} dangerouslySetInnerHTML={{__html: accountIcon}} className="account-icon"></a>
        <Modal
          style={customStyles}
           isOpen={this.state.showModal}
           contentLabel="Minimal Modal Example">
          <a onClick={this.handleCloseModal} dangerouslySetInnerHTML={{__html: cancelIcon}} className="cancel-icon"></a>
          <a className="feedback-label" href="https://www.setlist.ie/pages/contact-us">Feedback</a>
          <a href="https://www.setlist.ie/pages/contact-us" className="help-label">Help</a>
          <a href="https://www.setlist.ie/pages/contact-us" dangerouslySetInnerHTML={{__html: triangleIcon}} className="triangle-icon"></a>
          <a href="https://www.setlist.ie/pages/contact-us" className="share-label">Share the app</a>
          <div onClick={this.handleLogout} className="log-out-label">Log out</div>
        </Modal>
        <h5 className="account-label">My Account</h5>
        </div>



        {/* <div className="join-session-component">
        <a dangerouslySetInnerHTML={{__html: scanQrCode}} onClick={this.changeBG} className="join-session-icon"></a>
        <h5 className="join-session-label">Scan QR Code</h5>
        </div> */}


      </div>



        <a onClick={this.handleClick.bind(this)} dangerouslySetInnerHTML={{__html: setlistLogo}} className="setlist-logo-no-text"></a>
        <h3 style={h3Style}>TAP TO START A NEW SESSION</h3>



      </div>

      </div>
    );
   }
  }

export default connect(state => state)(Session);

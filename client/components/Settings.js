import React, { Component } from 'react';
import { connect }      from 'react-redux';
import hamburgerMenuIcon from '../hamburgerMenuIcon.svg';
import friendsIcon from '../friendsIcon.svg';
import { socket } from './App';
import Modal from 'react-modal';
import { slide as Menu } from 'react-burger-menu';
//import joinSessionIcon from '../joinSessionIcon.svg';
import cancelIcon from '../cancel.svg';
import arrow from '../arrow.svg';
import settings from '../edit-tools.svg';
import crown from '../crown.png';
import triangleIcon from '../triangle.svg';
import home from '../home.svg';
import defaultProfile from '../default.png';
import plus from '../plus.svg';

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

const menuStyle = {
  zIndex: '1000'
}

const row1 = {
  marginRight: '10px'
}

const iframe = {
  zIndex: '2',
  position: 'absolute'

}

const cancelStyle = {
  fill: '#FFFFFF',
  opacity: '0.8'
}

const menu = {
  zIndex: '100',
  position: 'absolute',


}

const h5Style = {
  marginLeft: '35px',
  fontWeight: 'bold',
  marginTop: '-2px'
}

const modal3 = {
  fontSize: '13px',
  fontWeight: '0',
  marginTop: '20px',
  opacity: '0.85',
  marginLeft: '-5px'
}



class Settings extends Component {


  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.state = ({showModal: false, value: `https://open.spotify.com/embed/user/${this.props.params.userInfo_Id}/playlist/${this.props.params.playlistId}`, color: "linear-gradient(180deg, #1E1E1E 0%, rgba(30, 30, 30, 0.87) 87.5%)", users: [{name: "test", image: crown}] });
  }

 

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  handleHome(){
    const uid = this.props.params.uid;
    window.location.href = "/#/session" + "?UID=" + uid;
  }

  handleGoBack(){
    window.location.href = "/#/config-setlist/:host/:sessionId/:uid"
    console.log("Do stuff");
  }


  handleLogout(){
    localStorage.removeItem('loggedIn');
    window.location.href = '/#/';
  }


  render() {


    const bg_style = {background: this.state.color};

    const users = this.state.users;
   
    return (


    <div style={bg_style} className="position-fixed w-100 h-100">


        <div className="hnav-bar position-fixed w-100" >

        <div classnName="row">
          <a dangerouslySetInnerHTML={{__html: arrow}} onClick={this.handleGoBack} className="back-arrow col ml-2"></a>
        </div>

        <div className="row">
         
        </div>

        </div>

    </div>







    );
  }
  }

export default connect(state => state)(Settings);

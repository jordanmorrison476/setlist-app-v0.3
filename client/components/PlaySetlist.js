import React, { Component } from 'react';
import { connect }      from 'react-redux';
import hamburgerMenuIcon from '../hamburgerMenuIcon.svg';
import friendsIcon from '../friendsIcon.svg';
import { socket } from './App';
import Modal from 'react-modal';
import { slide as Menu } from 'react-burger-menu';
//import joinSessionIcon from '../joinSessionIcon.svg';
import cancelIcon from '../cancel.svg';
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



class PlaySetlist extends Component {


  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.state = ({showModal: false, value: `https://open.spotify.com/embed/playlist/${this.props.params.playlistId}`, color: "linear-gradient(180deg, #1E1E1E 0%, rgba(30, 30, 30, 0.87) 87.5%)", users: [{name: "test", image: crown}] });
  }



  componentDidMount(){
    socket.emit('session-complete');
    var loggedIn = localStorage.getItem('loggedIn');
    if(loggedIn === null){
      window.location.href = '/#/'
    }

    socket.on('playSetlistMembers', function(data){
      console.log("TESTTTTTT");
      state.users = []
      this.setState(state => {
        const users = state.users.concat(data.users);
        return {
          users,
        };
      });
    }.bind(this));

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

  handleSettings(){
    console.log("Do stuff");
  }


  handleLogout(){
    localStorage.removeItem('loggedIn');
    window.location.href = '/#/';
  }


  render() {


    const bg_style = {background: this.state.color};

    const users = this.state.users;

    console.log(users);

    const items = [];

    for (const [index, value] of users.entries()){

      if(value.image == 'null'){
        value.image = defaultProfile;
      }

        items.push(
            <div className="member-card">
              {<img className="member-img" src={value.image}/>}
               <h6 key={index} className="member-name">{value.name}</h6>
            </div>)
    }

    return (


    <div style={bg_style} className="position-fixed w-100 h-100">


        <div className="hnav-bar position-fixed w-100" >

        </div>

      <div class="iframe embed-responsive embed-responsive-16by9" style={iframe}>

        <iframe className="embed-responsive-item" src={this.state.value}  frameBorder="0"  style={iframe} ></iframe>

        <Modal
          style={customStyles}
           isOpen={this.state.showModal}
           contentLabel="Minimal Modal Example">
          <a onClick={this.handleCloseModal} dangerouslySetInnerHTML={{__html: cancelIcon}} style={cancelStyle} className="cancel-icon"></a>
          <h5 style={h5Style}> Session Members ({this.state.users.length})</h5>
          <h6 style={modal3}>This is a list of the all people currently in the session. </h6>

            {items}

        </Modal>

      </div>


      <Menu left width={'49%'} style={menu}>
        <div style={row1} className="row">
          <a onClick={this.handleHome} dangerouslySetInnerHTML={{__html: home}}  className="home-icon col-6"></a>
          <a id="home" className="menu-item home-label" onClick={this.handleHome}>Home</a>
        </div>
        <div className="row mt-3">
            <a onClick={this.handleSettings} dangerouslySetInnerHTML={{__html: settings}}  className="settings-icon col-6"></a>
              <a id="settings" className="menu-item settings-label" onClick={this.handleSettings}>Settings</a>
        </div>
        <div className="row mt-3">
            <a onClick={this.handleNewSetlist} dangerouslySetInnerHTML={{__html: plus}}  className="new-setlist-icon col-6"></a>
              <a id="new-setlist" className="menu-item new-setlist-label" onClick={this.handleNewSetlist}>New Setlist</a>
        </div>
        <div className="row mt-3">
              <h5 id="setlist-list" className="menu-item setlist-list-label ml-3"> Setlists</h5>
        </div>
      </Menu>




    </div>







    );
  }
  }

export default connect(state => state)(PlaySetlist);

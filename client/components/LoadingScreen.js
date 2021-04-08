import React, { Component } from 'react';
import { connect }      from 'react-redux';
import hamburgerMenuIcon from '../hamburgerMenuIcon.svg';
import friendsIcon from '../friendsIcon.svg';
import { socket } from './App';
import Modal from 'react-modal';
import { slide as Menu } from 'react-burger-menu';
//import joinSessionIcon from '../joinSessionIcon.svg';
import cancelIcon from '../cancel.svg';
import triangleIcon from '../triangle.svg';
import home from '../home.svg';
import defaultProfile from '../default.png';

const customStyles = {
  content : {
    top                   : '270px',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    height                : '350px',
    width                 : '330px',
    borderRadius: '20px',
    background: '#000000',
    border: '0.5px solid #ACA8A8',

  }
};

const cancelStyle = {
  fill: '#FFFFFF',
  opacity: '0.8'
}

const h5Style = {
  marginLeft: '35px',
  fontWeight: 'bold',
  marginTop: '-2px'
}

const h6Style = {
  marginLeft: '-5px',
  fontWeight: 'normal',
  marginTop: '15px',
  fontSize: '12px',
  opacity: '0.85',
}

const text = {
  marginRight: '40px',
  marginTop: '6px'

}

const lblStyle = {
  marginLeft: '-8px',
  fontSize: '12pt'
}

const linkStyle = {
  marginTop: '70px',
  marginRight: 'px',
  width: '290px',
  marginLeft: '-1px',
  backgroundColor: '#272727',
  color: '#A1A1A1',
  fontSize: '9px',
  borderRadius: '0px',
  border: 'none',
  padding: '10px',

}

const copyStyle = {
  color: '#0A40FF',
  marginLeft: '230px',
  marginTop: '-26px',
  cursor: 'pointer',

}

const memberCount = {

}

const copyStatus = {
  marginLeft: '50px',
  color: '#FFFFFF'
}

const menuStyle = {
  zIndex: '100'
}

const userList = {
  marginLeft: '14em'
}

const modal3 = {
  fontSize: '13px',
  fontWeight: '0',
  marginTop: '20px',
  opacity: '0.85',
  marginLeft: '-5px'
}


class LoadingScreen extends Component {

  constructor(props){
    super(props);
    this.handleHome = this.handleHome.bind(this);
    this.handleOpenModal3 = this.handleOpenModal3.bind(this);
    this.handleCloseModal3 = this.handleCloseModal3.bind(this);
    this.state = ({sesh: this.props.location.query.sesh, uid : this.props.location.query.UID, color: "linear-gradient(180deg, #1E1E1E 0%, rgba(30, 30, 30, 0.87) 87.5%)", users:[]});
  }



  componentDidMount() {

    var sesh = this.state.sesh;
    var uid = this.state.uid;
    localStorage.setItem('uid', uid);
    socket.emit('join', {sesh: sesh, uid: uid});
    socket.on('update-sesh-members', function(link){
      window.location.href = link+'/'+ uid;
    })

  socket.on('sessionMembersCount', function(data){

    this.setState(state => {
      state.users = []
      const users = state.users.concat(data.users);
      return {
        users,
      };
    });
  }.bind(this));


    var loggedIn = localStorage.getItem('loggedIn');

  }

  handleHome(){
    const uid = this.props.params.uid;
    window.location.href = "/#/session" + "?UID=" + uid;
  }

  handleOpenModal3 () {
    this.setState({ showModal3: true });

  }

  handleCloseModal3 () {
    this.setState({ showModal3: false });
  }


  render() {

        const bg_style = {background: this.state.color};


        const users = this.state.users;

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

        <Menu left width={'49%'}>
          <div className="row">
            <a onClick={this.handleHome} dangerouslySetInnerHTML={{__html: home}}  className="home-icon col-6"></a>
            <a id="home" className="menu-item home-label" onClick={this.handleHome}>Home</a>
          </div>
        </Menu>


            <div className="hnav-bar position-fixed w-100" >

            <div className="friends-icon col-12 text-right mt-3">
               <a dangerouslySetInnerHTML={{__html: friendsIcon}} onClick={this.handleOpenModal3}></a>
               <h6 className="member-count">{this.state.users.length}</h6>
             </div>



            </div>

            <div className="loading center-block text-center ">

               <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

               <h3> Please wait while your host creates the Setlist . . . </h3>

               <Modal
                 style={customStyles}
                  isOpen={this.state.showModal3}
                  contentLabel="Minimal Modal Example">
                 <a onClick={this.handleCloseModal3} dangerouslySetInnerHTML={{__html: cancelIcon}} style={cancelStyle} className="cancel-icon"></a>
                 <h5 style={h5Style}> Session Members ({this.state.users.length})</h5>
                 <h6 style={modal3}>This is a list of the all people currently in the session. </h6>


                 {items}

               </Modal>


            </div>








        </div>





      );
    }
}


export default connect(state => state)(LoadingScreen);

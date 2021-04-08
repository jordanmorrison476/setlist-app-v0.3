import React, { Component } from 'react';
import loginSVG from '../log_in.svg';
import setlistLogo from '../setlist_logo_name.svg';
import appleLogin from '../apple_login.png';
import { socket, host, sesh, data2 } from './App';
import { log } from 'util';

const aStyle = {
  color: 'white',
};


export default class Login extends Component {
  constructor(props){
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.generateRandomString = N => ((Math.random()+1).toString(36)+Array(N).join('0')).slice(2, N+2);
    this.state = ({UID: this.props.location.query.UID});
  }


  handleLogin(e){
    // socket.emit("login");
    // fetch('/login');
    console.log("yuh");
    localStorage.setItem('loggedIn', true);
    // var set = localStorage.getItem('loggedIn');
    const UID = this.state.UID;
    // alert(set);



    //inject config parameters into the url to send server-side for processing
    window.location.href = "/login" + "?UID=" + UID;

  }

  componentDidMount(){
    socket.on(('connection'), function (socket) {

      console.log("NEW USER CONNECTED TO SITE", socket.id);
    })
    console.log(this.props);

    var host = this.props.location.query.host;
    var sesh = this.props.location.query.sesh;
    var UID = this.props.location.query.UID;
    var seshData = {
      host: host,
      sesh: sesh,
      UID: UID
    }
    var loggedIn = localStorage.getItem('loggedIn');
    console.log("LOGIN COMPONENT", seshData, UID);

    socket.emit('storeData', seshData);
    localStorage.removeItem('seshData');
    seshData = null;
    var uid = localStorage.getItem('uid');
    // if(loggedIn != null){
    //   alert(loggedIn);
    //   if(uid != null){
    //     window.location.href = '/#/session/'+ '?UID=' + uid;
    //   }else{
    //     localStorage.removeItem('loggedIn');
    //     alert("UID not set, please log in");
    //   }
    // }
    // }
  }
  render() {
    return (
      <div className="login_block d-flex flex-wrap justify-content-center position-absolute w-100 h-100 align-items-center align-content-center">

        <div className="login">
            <div className ="setlist-logo">
            <a dangerouslySetInnerHTML={{__html: setlistLogo}}></a>

            </div>
          <div className="spotify-login">
            <a onClick={this.handleLogin.bind(this)}  dangerouslySetInnerHTML={{__html: loginSVG}}></a>
          </div>

          {/*
          <div className="apple-login">
            <img className="apple-pic" src={appleLogin}/>
            <p className="soon">Coming Soon...</p>
          </div>

          <div className="lbl-login">
            <a style={aStyle}>Login using another app?</a>
          </div>

          <div className="lbl-sign-up">
            <a style={aStyle} >Sign up</a>
          </div>

          */}

          <div className="lbl-privacy-policy">
            <a style={aStyle} href="https://www.setlist.ie/pages/privacy-policy">Privacy policy</a>
          </div>

          <div className="lbl-terms-of-use">
            <a style={aStyle} href="https://www.setlist.ie/pages/terms-of-use">Terms of use</a>
          </div>


        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import { connect }      from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
//import { useAlert } from 'react-alert';

import friendsIcon from '../friendsIcon.svg';
import addFriendsIcon from '../addFriendsIcon.svg';
import setlistLogo from '../setlist_logo_name.svg';
import settings from '../edit-tools.svg';
import audienceBand from '../img-crowd-pleaser.png';
import audienceBand2 from '../audience-band-img2.png';
import crown from '../crown.png';
import defaultProfile from '../default.png';
import testMember from '../test_member.png';
import cancelIcon from '../cancel.svg';
import messenger from '../messengerIcon.svg';
import twitter from '../twitter.svg';
import whatsapp from '../whatsappIcon.svg';
import instagram from '../instagram2.svg';
import tick from '../tick.svg';
import questionMark from '../question.svg';
import home from '../home.svg';
import { socket } from './App';

const icoStyle = {
  float:'right',
  padding: '20px',
};

const l1Style = {
  top:'50px',
};

const link2Style = {

  textDecoration: "underline",
  fontSize: '14px',
  cursor: 'pointer',
  marginTop:'22px',
  marginLeft:'34%'

}

const imgStyle = {
 border: '1px solid #E149E4',
}

const btnStyle = {
  background: 'linear-gradient(180deg, #A31FA6 0%, #A31FA6 100%)',

};

const btnStyle2 = {
  background: '1DB954',
  fontSize:'16px',
  marginLeft: '30px'
};


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




//const alert = useAlert()


class ConfigSetlist extends Component {



  constructor(props) {
   super(props);

   this.handleChange = this.handleChange.bind(this);
   this.handleOpenModal = this.handleOpenModal.bind(this);
   this.handleCloseModal = this.handleCloseModal.bind(this);
   this.handleOpenModal1 = this.handleOpenModal1.bind(this);
   this.handleCloseModal1 = this.handleCloseModal1.bind(this);
   this.handleOpenModal2 = this.handleOpenModal2.bind(this);
   this.handleCloseModal2 = this.handleCloseModal2.bind(this);
   this.handleOpenModal3 = this.handleOpenModal3.bind(this);
   this.handleCloseModal3 = this.handleCloseModal3.bind(this);
   this.handleCopySuccess = this.handleCopySuccess.bind(this);
   this.handleHome = this.handleHome.bind(this);
   this.handleSettings = this.handleSettings.bind(this);
   this.state = ({value: `https://setlistwebapp.herokuapp.com/${this.props.params.host}/${this.props.params.sessionId}`, showModal: true, showModal1: false, showModal2: false, showModal3: false, isOpen: false, setlistName: '' , genre: '', param1: '' , param2: '' , param3: '' , param4: '' , param5: '', color: "linear-gradient( #1E1E1E 0%, rgba(30, 30, 30, 0.87) 87.5%)", copySuccess: false,
    twitterLink: `https://twitter.com/intent/tweet?text=Hey `+`I've `+`just `+`started `+`a `+`new `+ `Setlist `+`session, `+`join `+`by `+`clicking `+`this `+`link!\n ` + `https://setlistwebapp.herokuapp.com/${this.props.params.host}/${this.props.params.sessionId}`,
    messengerLink: `fb-messenger://share/?link=https://setlistwebapp.herokuapp.com/${this.props.params.host}/${this.props.params.sessionId}`, users: [{name: this.props.params.host, image: crown}]
  /*whatsappLink: `https://api.whatsapp.com/send?phone=0833641119&text=%20` + `Hey `+`I've `+`just `+`started `+`a `+`new `+ `Setlist `+`session, `+`join `+`by `+`clicking `+`this `+`link!\n ` + `https://setlistwebapp.herokuapp.com/false/${this.props.params.sessionId}`*/});

   }


   componentDidMount(){


      var sesh = this.props.params.sessionId;
      var uid = this.props.params.uid;
      var users = this.state.users;

      socket.emit('join', {sesh: sesh, uid: uid});
      localStorage.setItem('sesh', sesh );
      // var loggedIn = localStorage.getItem('loggedIn');
     socket.on('userJoined', function(userProfile){
       let preCheckUsers = this.state.users.concat(userProfile)
       let users = [...new Set(preCheckUsers)];
       console.log(users);
       //update the ui with the username saying they have joined
       console.log(`New user joined ${userProfile.name}`)
       this.setState(state => {
         const users = state.users.concat(userProfile);

         socket.emit('updateClients', {users: users, sesh: sesh});
         return {
           users,
         };
       });
     }.bind(this));

  }




   handleChange(event) {
     const target = event.target;
     const name = target.name;
     const value = target.value;
     this.setState({
      [name]: value
    });

  }

  handleHome(){
    const uid = this.props.params.uid;
    window.location.href = "/#/session" + "?UID=" + uid;
  }

  handleSettings(){
    console.log("Do stuff");
    window.location.href = "/#/settings/:host/:sessionId/:uid";
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }


  handleCloseModal () {
    this.setState({ showModal: false });
  }

  handleOpenModal1 () {
    this.setState({ showModal1: true });

  }

  handleCloseModal1 () {
    this.setState({ showModal1: false });
  }

  handleOpenModal2 () {
    this.setState({ showModal2: true });

  }

  handleCloseModal2 () {
    this.setState({ showModal2: false });
  }

  handleOpenModal3 () {
    this.setState({ showModal3: true });

  }

  handleCloseModal3 () {
    this.setState({ showModal3: false });
  }



  handleCopySuccess(e) {


    e.preventDefault();
    navigator.clipboard.writeText(this.state.value);
    this.state.copySucess = true;
    console.log("Link copied successfully!");
    if(this.state.copySuccess){
      return <h6 style={copyStatus}>Copy success!</h6>;
    }

  }

  /*
 copyToClipboard(e) {
      e.preventDefault();
      navigator.clipboard.writeText(this.state.value)}
      alert.show("Link Copied!");
      console.log(this.state.value);
  }

*/

 handleClick(e) {
    const setlistName = this.state.setlistName;
    const genre = this.state.genre;
    const param1 = this.state.param1;
    const sesh = this.props.params.sessionId;
    const host = this.props.params.host;
    const uid = this.props.params.uid;
    const users = this.state.users;

    socket.emit('sendSessionMemberCount', {sesh: sesh, users: users});

    //inject config parameters into the url to send server-side for processing

    window.location.href = "/setConfigParams" + "?setlistName=" + setlistName + "&genre=" +  genre + "&p1=" + param1 + "&host=" + host + "&sesh=" + sesh + "&uid=" + uid;
  }


  showSettings (event) {
      event.preventDefault();

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
              <a dangerouslySetInnerHTML={{__html: cancelIcon}}  className="member-remove"></a>
            </div>)
    }


    return (
      <div style={bg_style} className="position-fixed w-100 h-100">

            <div className="hnav-bar position-fixed w-100" >

              <div className="row">

              <div className="friends-icon col-12 text-right mt-3">
                 <a dangerouslySetInnerHTML={{__html: friendsIcon}} onClick={this.handleOpenModal3}></a>
                 <h6 className="member-count">{this.state.users.length}</h6>
               </div>


              <div className="btn-add-friends login_block d-flex flex-wrap justify-content-center position-absolute w-100 h-100 align-items-center align-content-center col-12">
              <a onClick={this.handleOpenModal}>
                <div style={btnStyle2} className="btn ready-button  ">
                  <div style={text}>
                  Add Friends To Session
                    <div dangerouslySetInnerHTML={{__html: addFriendsIcon}} className="invite-friends-icon float-right">
                    </div>

                  </div>
                </div>
              </a>
              </div>

              {/*  <div className="friends-icon float-right mt-3 mr-5">
                  <a dangerouslySetInnerHTML={{__html: friendsIcon}}></a>
                </div> */}

              </div>

          </div>





          {/*
            <div className="configure-preset-icon position-fixed pl-2 ml-4">
              <a onClick={this.handleOpenModal2} dangerouslySetInnerHTML={{__html: questionMark}}></a>
            </div>



            <Modal
              style={customStyles}
               isOpen={this.state.showModal2}
               contentLabel="Minimal Modal Example">
              <a onClick={this.handleCloseModal2} dangerouslySetInnerHTML={{__html: cancelIcon}} style={cancelStyle} className="cancel-icon"></a>

              <div className="help-text">
                <h4>
                 Need help?
                </h4>

                <ul>
                 <li className="mt-2"> Step 1. Add friends to the session by tapping the plus icon (+) </li>

                 <li className="mt-3">  Step 2. Choose your Setlist preset (Crowd Pleaser is set to default in this version) </li>

                 <li className="mt-3"> Step 3. Name your Setlist (optional) </li>

                 <li className="mt-3">  Step 4. Create your perfect playlist by tapping the 'Create Setlist' button </li>

                </ul>
              </div>

            </Modal>



            {/*<div className="configure-preset-label">
                <h5> Advanced </h5>
            </div>*/}







            {/*
                <div className="invite-friends-icon float-right">

                  <a onClick={this.handleOpenModal} dangerouslySetInnerHTML={{__html: addFriendsIcon}}></a>

                </div>

                <h5 className="invite-friends-label mr-2 float-right"> Add Friends </h5>

                */}


                <Modal
                  style={customStyles}
                   isOpen={this.state.showModal}
                   contentLabel="Minimal Modal Example">
                  <a onClick={this.handleCloseModal} dangerouslySetInnerHTML={{__html: cancelIcon}} style={cancelStyle} className="cancel-icon"></a>
                  <h5 style={h5Style}>Invite Friends</h5>
                  <h6 style={h6Style}>Invite friends to the session using your favourite social media platforms. Or copy the link below.</h6>
                  <a className="messenger-icon" target="_blank" href={this.state.messengerLink} dangerouslySetInnerHTML={{__html: messenger}}></a>
                  <a className="twitter-icon" target="_blank" href={this.state.twitterLink}  dangerouslySetInnerHTML={{__html: twitter}}></a>
                  {/* <a className="whatsapp-icon" target="_blank"  dangerouslySetInnerHTML={{__html: whatsapp}}></a>
                  <a className="instagram-icon" target="_blank"  dangerouslySetInnerHTML={{__html: instagram}}></a> */}
                  <input style={linkStyle} maxLength="10" type="text" className="session-link form-control" id="link"  value={this.state.value.slice(0, 45)} readOnly/>
                  <h5 onClick={this.handleCopySuccess} style={copyStyle}>COPY</h5>
                  <h6 style={link2Style} onClick={this.handleCloseModal}>Skip for now</h6>
                    <div onClick={this.handleCloseModal} className="btn-done">
                      <h5 className="lbl-done">Done</h5>
                    </div>

                </Modal>



            <div className="console position-fixed w-100">

              <div className="row mt-3">

                <div className="presets-label col">
                  <h5> Presets </h5>
                </div>

                <div className="moods-label col">
                  <h5> Moods </h5>
                </div>

                <div className="genres-label col">
                  <h5> Genres </h5>
                </div>

                <div className="artists-label col">
                  <h5> Artists </h5>
                </div>

              </div>


              <div style={l1Style} className="line-1 w-100">
              </div>

              <a onClick={this.handleOpenModal1}>
                {<img className="audience-band-img" src={audienceBand}/>}
                </a>
                <Modal
                  style={customStyles}
                   isOpen={this.state.showModal1}
                   contentLabel="Minimal Modal Example">
                  <a onClick={this.handleCloseModal1} dangerouslySetInnerHTML={{__html: cancelIcon}} style={cancelStyle} className="cancel-icon"></a>
                  <h5 style={h5Style}>Crowd Pleaser</h5>
                  <h6 style={h6Style}>This Setlist finds popular artists and tracks that everyone will like. Use the settings below to configure the preset.</h6>
                  <label style={lblStyle} htmlFor="share-session-button">Choose a genre:</label>
                  <input type="text" className="txtGenre form-control"  id="name" name="genre" value={this.state.genre} onChange={this.handleChange} />

                    <div onClick={this.handleCloseModal1} className="btn-done">
                      <h5 className="lbl-done">Done</h5>
                    </div>


                </Modal>


                <Modal
                  style={customStyles}
                   isOpen={this.state.showModal3}
                   contentLabel="Minimal Modal Example">
                  <a onClick={this.handleCloseModal3} dangerouslySetInnerHTML={{__html: cancelIcon}} style={cancelStyle} className="cancel-icon"></a>
                  <h5 style={h5Style}> Session Members ({this.state.users.length})</h5>
                  <h6 style={modal3}>This is a list of the all people currently in the session. Add more people by using the add friends to session button.</h6>

                  {items}



                </Modal>


                <div className="crowd-pleaser-label">
                  <h5> Crowd Pleaser </h5>
                </div>


              </div>



              <div className="btn-create-setlist login_block d-flex flex-wrap justify-content-center position-absolute w-100 h-100 align-items-center align-content-center">
                <input placeholder="Name your Setlist" type="text" autoComplete="off"   className="setlist-name mb-4 col-11 form-control"  id="name" name="setlistName" value={this.state.setlistName} onChange={this.handleChange} />
                <a onClick={this.handleClick.bind(this)}>
                  <div style={btnStyle} className="btn ready-button ">
                  Create Setlist
                  </div>
                </a>
              </div>






          <Menu left width={'49%'}>
            <div className="row">
            <a onClick={this.handleHome} dangerouslySetInnerHTML={{__html: home}}  className="home-icon col-6"></a>
              <a id="home" className="menu-item home-label" onClick={this.handleHome}>Home</a>
            </div>
            <div className="row mt-3">
            <a onClick={this.handleSettings} dangerouslySetInnerHTML={{__html: settings}}  className="settings-icon col-6"></a>
              <a id="settings" className="menu-item settings-label" onClick={this.handleSettings}>Settings</a>
            </div>
          </Menu>


      </div>



    );
   }
  }

export default connect(state => state)(ConfigSetlist);

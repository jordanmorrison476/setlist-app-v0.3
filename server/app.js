'use strict';

/** Module dependencies. */
const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const path         = require('path');
const logger       = require('morgan');
// const routes       = require('./routes');
const favicon = require('serve-favicon');
const session = require('express-session');
const Spotify = require('spotify-web-api-node');
const querystring = require('querystring');
const router = new express.Router();
const admin = require('firebase-admin');
const {Firestore} = require('@google-cloud/firestore');
const serviceAccount = require('../serviceAccountKey.json');
const moment = require('moment');
const firestore = new Firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

const port = process.env.PORT || 3000;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// grab the Mixpanel factory
var Mixpanel = require('mixpanel');

var mixpanel = Mixpanel.init('16b459aae9da79eda85c07c7ca2da272');

let db = admin.firestore();

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => ((Math.random()+1).toString(36)+Array(N).join('0')).slice(2, N+2);
const pfx = 'spotify:track:';


// configure the express server
const CLIENT_ID = process.env.id;
const CLIENT_SECRET = process.env.secret;
const REDIRECT_URI = process.env.redirect_uri || 'https://setlistwebapp.herokuapp.com/callback';
const STATE_KEY = 'spotify_auth_state';
let SESSION_ID = '';
let HOST = true;
let USER_ID = '';
// your application requests authorization
const scopes = ['user-read-private', 'user-read-email','user-read-birthdate', 'user-library-read', 'playlist-read-private' , 'user-top-read', 'user-read-recently-played' , 'playlist-modify-public' ,  'playlist-modify-private'];

// configure spotify
const spotifyApi = new Spotify({
  clientId: 'e3a7bc8295f244d392babe0bcbe65454',
  clientSecret: 'e82cc74ec6b142539212c9ee91f50907',
  redirectUri: 'http://localhost:3000/callback'//  'https://setlistwebapp.herokuapp.com/callback' //'https://app.setlist.ie/callback',
  //'http://localhost:3000/callback',
  //'https://setlist-testing.herokuapp.com/callback'
  //make sure dev redirect uri isn't pushed to master!!!!
});



// configure the express server
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usersSockets = {}; //Key: socket, Value: username
// var users = {}; //Key: username, Value: socket

// if we're developing, use webpack middleware for module hot reloading
if (process.env.NODE_ENV !== 'production') {
  console.log('==> using webpack');

  // load and configure webpack
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack/dev.config');



  // setup middleware
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler));

}

app.set('port', port);
app.use(logger('dev'))
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(express.static(path.resolve(__dirname, '../public')));
  // .use('/', routes);

http.listen(port, () => {
  console.log('Express server listening on port ' + app.get('port'));
});

// if (process.env.NODE_ENV === 'production') {
//   // Exprees will serve up production assets
//   app.use(express.static('client/build'));

//   // Express serve up index.html file if it doesn't recognize route
//   const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
//   });
// }
// the master object containing a list of all the sessions
const seshCollection = {
  totalSeshCount : 0,
  sessions : {}
}

// Arrays and Objects for tracking logged in user info

const masterSessions = {};

const masterUsers = {};

function addToSession(userData, socket, sessionId){

}
/*
* Function that creates a session object with a host, an id and
* the number of users in the session and an array that initially
* contains just the host's id but will contain the id of each
* user that is added to the session
*/
function createSession(uid){
  // console.log(socket.id);
  console.log(seshCollection.sessions);

  // finding the host id associated with the socket
  var host = masterUsers[uid];

  var hostId = host.id;
  var seshObject = {};
  seshObject.Id = (Math.random()+1).toString(36).slice(2, 18);
  var seshId = seshObject.Id;
  console.log("Session Created by "+ hostId + " w/ " + seshObject.Id);
  seshObject.host = hostId;
  seshObject.numUsers = 1;
  seshObject.users = [hostId];
  if(Object.keys(seshCollection).length === 0){
    seshCollection.totalSeshCount =  1;
    seshCollection.sessions[seshId] = seshObject;
  }else{
    seshCollection.totalSeshCount++;
    seshCollection.sessions[seshId] = seshObject;
  }

  console.log(seshCollection);
  return {hostId, seshId};

}




// socketio listening for a connection
io.on(('connection'), function (socket) {

  console.log("NEW USER CONNECTED TO SITE", socket.id);

  socket.on('join', function(data){

   socket.join(data.sesh);

   var userId = masterUsers[data.uid].id;
   let userProfile = {};


   db.collection("users").where("id", "==", userId)
     .get()
     .then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             // doc.data() is never undefined for query doc snapshots
             userProfile = doc.data();
             socket.to(data.sesh).emit("userJoined", {name: userProfile.name, image: userProfile.image});
         });
     })
     .catch(function(error) {
         console.log("Error getting documents: ", error);
     });


 })

 socket.on('updateClients', function(data){
  socket.join(data.sesh);


//do check for duplicate session members here. Preferably using the UID to check

function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject  = {};

  for(var i in originalArray) {
     lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for(i in lookupObject) {
      newArray.push(lookupObject[i]);
  }
   return newArray;
}

  try{
    var uniqueArray = removeDuplicates(data.users, "name");
    console.log("uniqueArray is: " + JSON.stringify(uniqueArray));
    socket.to(data.sesh).emit("sessionMembersCount", {users: uniqueArray});
  }catch{
    console.log("No Duplicate Members in the session")
    socket.to(data.sesh).emit("sessionMembersCount", {users: data.users});
  }
  
  })

  socket.on('sendSessionMemberCount', function(data){
    socket.to(data.sesh).emit("playSetlistMembers", {users: data.users});
  });


  //listens for a disconnect
  socket.on('disconnect', function() {
    console.log('USER DISCONNECTED!');
 });

  //when the client  requests to make a session
  socket.on('makeSesh', function () {
    // createSession(socket);

   io.emit('sessionCreated', {
     username: socket.username,
     seshId: seshObject.id
   });

 });

 socket.on('login', function(){
  console.log("USER SUCCESSFULLY LOGGED IN");
 });

 socket.on('new-session', function(){
  console.log("NEW SESSION STARTED");
 });

 socket.on('session-complete', function(){
  console.log("SESSION COMPLETE");
  console.log(seshCollection.sessions);
  console.log("FULL COLLECTION ", seshCollection);

 })

 socket.on('data2', data => {
   console.log("-------------FIRST PIECE---------", data.host);
   console.log("---------------SECOND PIECE ------------", data.sesh);


 })



 socket.on('storeData', data => {
  console.log("DATA NEEDS TO BE STORED");
  console.log(data);
//  ack = true;
  if(data.UID != undefined){
    trackClient(socket, data.host, data.sesh, data.UID);
  }

 } )

 function createRoom(id){
 }

  /*
 * Function that creates the initial user object which just consist of the
 * users's socket and their access and refresh tokens so that we may refer to
 * them later with the spotify getme
 */
function sendTokens(socket, access, refresh, uid){
  var clientUserObj;
  var size = Object.keys(masterUsers).length;
  var time = moment().format();
  if (size == 0){
    var userObj = {};
    userObj.socket = socket;
    userObj.sockId = socket.id;
    userObj.accessToken = access;
    userObj.access_time = time;
    userObj.refreshToken = refresh;
    userObj.address = socket.handshake.headers['x-forwarded-for'];
    userObj.role = 'host';
    userObj.UID = uid;
    console.log("ACCESS", userObj.accessToken);
    masterUsers[uid] = userObj;
    console.log(userObj);

    return userObj;
  }else{
    var clientUserObj = masterUsers[uid];
      console.log("---------NEW USER Socket----------",socket.id);

      console.log("---------clientUserObj ----------", clientUserObj);
    if (typeof clientUserObj === 'object' && clientUserObj !== null){
      console.log("---------clientUserObj Socket----------",clientUserObj.sockId);
      console.log("IF");

      clientUserObj.accessToken = access;
      clientUserObj.refreshToken = refresh;
      socket._UID = uid;
      console.log("ACCESS", clientUserObj.accessToken);
      return clientUserObj;

    }else{
      console.log("ELSE");

      var userObj = {};
      userObj.socket = socket;
      userObj.sockId = socket.id;
      userObj.accessToken = access;
      userObj.access_time = time;
      userObj.refreshToken = refresh;
      userObj.address = socket.handshake.headers['x-forwarded-for'];
      userObj.role = 'host';
      userObj.UID = uid;
      console.log("ACCESS", userObj.accessToken);
      masterUsers[uid] = userObj;
      return userObj;
    }
  }

 }




 /*
 * function to keep track of the session and host for a client
 * while they are going through the login process
 */
 function trackClient(socket, host, seshId, uid){
  if(!(uid in masterUsers)){
    var userObj = {};
    console.log("-------------------CLIENT SOCKET ID------------", socket.id);

    //  userObj.socket = socket;
    userObj.socket = socket;
    userObj.linkedHost = host;
    userObj.linkedSesh = seshId;
    userObj.sockId = socket.id;
    userObj.role = 'client';
    userObj.address = socket.handshake.headers['x-forwarded-for'];
    userObj.UID = uid;
    masterUsers[uid] = userObj;
  }
  else{
    console.log("----------------USER ALREADY EXISTS--------------------------");

  }
  console.log("----------------MASTER USERS-------------", masterUsers, "----------------------");

}


app.io = io;

//use strict??//use strict??



/**
 * CHECK IF  OR HOST
 */

//redirect to root of the application and pick up parameters from the header
app.get('/:host/:sessionId', function(req, res) {
    var UID = generateRandomString(12);
    console.log("------------------HOST--------------", req.params.host);
    console.log("-------------SESH ID---------------", req.params.sessionId);
    var data = {
      host: req.params.host,
      sesh: req.params.sessionId
    };

    const query = querystring.stringify({
      'host': req.params.host,
      'sesh': req.params.sessionId,
      'UID' : UID
    });
    console.log("----------------MASTER USERS-------------", masterUsers, "----------------------");
    console.log("----------- DATA -------------", data);

    socket.emit("hostAndSession", data );

    //redirect to root after param collection
    res.redirect(`/#/?`+ query);


});



/**
 *END CHECK IF  OR HOST
 */

/**
 * The /login endpoint
 * Redirect the let  to the spotify authorize url, but first set that user's
 * state in the cookie.
 */
app.get('/login', (req, res) => {
  var state = null;
  console.log("(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((UID ))))))))))))))))))))))))))))))))))))))", req.query.UID);
  if(req.query.UID == 'undefined' || req.query.UID === '' || req.query.UID === null){
    console.log("(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((STATE WAS NOT DEFINED))))))))))))))))))))))))))))))))))))))", state);
    state = generateRandomString(12);
  }else {
    state = req.query.UID;
  }

  res.cookie(STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

app.get('/test', (req,res) => {
  res.redirect('/#/test');
})

/**
 * The /callback endpoint - hit after the user logs in to spotifyApi
 * Verify that the state we put in the cookie matches the state in the query
 * parameter. Then, if all is good, redirect the user to the user page. If all
 * is not good, redirect the user to an error page
 */
app.get('/callback', (req, res) => {
  var { code } = req.query;
  var state = req.query.state;
  console.log("(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((SENT UID IN STATE))))))))))))))))))))))))))))))))))))))", state);

  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  // first do state validation
  if (state === null || state !== storedState) {
    console.log('State mismatch (001)');
    res.redirect('/#/error/Oops something went wrong! Error Code: (001)');
  // if the state is valid, get the authorization code and pass it on to the client
  } else if (state === undefined){

  }
  else {
    res.clearCookie(STATE_KEY);
    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(data => {
      const { expires_in, access_token, refresh_token } = data.body;

    

      console.log("ACCESS TOKEN EXPIRES IN =====" + expires_in  );

    /*
    * using the tokens object to pass along the tokens without needing global variables
    */
    var usr = {}
    usr = sendTokens(socket, access_token, refresh_token, state);
    console.log(usr);

    console.log("----------------MASTER USERS-------------", masterUsers, "----------------------");

    checkIfRegistered(null, usr);

    /**
      * Check if the user is a registered Setlist user by matching MSS id to a user on the dB
      * IF not a registered user, create their profile
      *
      */

    async function checkIfRegistered(callback, user){
      // changed it up a bit so that the spotifyAPI access and refresh tokens are set up with the specific user's tokens
      // after they are retrieved from the collection instead of setting them the moment the user signs in as we were doing previously.
        spotifyApi.setAccessToken(user.accessToken);
        spotifyApi.setRefreshToken(user.refreshToken);
        spotifyApi.getMe().then(({ body }) => {
          user.id = body.id;
          console.log("(((((((((((((((((((((((((((((((((((((((((((((((((FIRST GETME)))))))))))))))))))))))))))))))))", body.id);
          console.log(user.id);
          console.log("CHECKIFREGISTERED-------", user);
          console.log("----------------MASTER USERS-------------", masterUsers, "----------------------");
          sendId(user);
        })


    }

     async function sendId(user){
        let urlQuery = querystring.stringify({
          'UID' : user.UID
        });
        let clientQuery = querystring.stringify({
          'sesh' : user.linkedSesh,
          'UID' : user.UID
        })
        let docRef = db.collection('users');
        let query = docRef.where('id', '==', user.id).get()
        .then(snapshot => {
        if (snapshot.empty) {
          console.log('\n ------------------------------------------------- \n The user is not registered, create Setlist profile \n ------------------------------------------------- \n');
          if (user.role == 'host'){
            
            //mixpanel user metric tracking
         
            mixpanel.track('User Logged In', {
              distinct_id: user.id,
            }); 
             console.log("\n ------------------------------------------------- \n THE USER IS A HOST. \n ------------------------------------------------- \n ");
             firstGet(user.UID);
          } else {
            
            //mixpanel user metric tracking
          
            mixpanel.track('User Logged In', {
              distinct_id: user.id,
            }); 
              console.log("\n ------------------------------------------------- \n THE USER IS NOT A HOST \n ------------------------------------------------- \n ");
              firstGet(user.UID);
        }

        }else{
          console.log("\n ------------------------------------------------- \n The user is registered, log them in. \n ------------------------------------------------- \n ");
          if (user.role == 'host'){

            //mixpanel user metric tracking
        
            mixpanel.track('User Logged In', {
              distinct_id: user.id,
            }); 

             console.log("\n ------------------------------------------------- \n THE USER IS A HOST \n ------------------------------------------------- \n ");
             res.redirect(`/#/session/?`+ urlQuery);
             io.emit('login');
          } else {
               console.log("\n ------------------------------------------------- \n THE USER IS NOT A HOST \n ------------------------------------------------- \n ");
               
              //mixpanel user metric tracking
            
               mixpanel.track('User Logged In', {
                distinct_id: user.id,
              }); 
             
               pushClientId(user.id, user.linkedSesh);
               res.redirect(`/#/loading/?`+ clientQuery);
          }
         }
        })
      }

    async function firstGet(userId) {
      let user = masterUsers[userId];
      let GBLARR1 = [];
      let GBLARR2 = [];
      let GBLARR3 = [];

      let topSTracks_Track_Name = [];
      let topSTracks_Track_Id = [];
      let topSTracks_Track_Popularity = [];
      let topSTracks_Artist_Name = [];
      let topSTracks_Artist_Id = [];

      let topMTracks_Track_Name = [];
      let topMTracks_Track_Id = [];
      let topMTracks_Track_Popularity = [];
      let topMTracks_Artist_Name = [];
      let topMTracks_Artist_Id = [];

      let topLTracks_Track_Name = [];
      let topLTracks_Track_Id = [];
      let topLTracks_Track_Popularity = [];
      let topLTracks_Artist_Name = [];
      let topLTracks_Artist_Id = [];

      let RecentlyPlayedTracks = {};
      let UserInfo = {};
      let SavedTracks = {};

      spotifyApi.setAccessToken(user.accessToken);
      spotifyApi.setRefreshToken(user.refreshToken);
      try{
        //getMe endpoint data retrieval
        spotifyApi.getMe().then(({ body }) => {

        try {
          let image = body.images[0].url;
          let locUserInfo = {name: body.display_name , id: body.id , email : body.email , dob : body.birthdate , country : body.country , product : body.product, image: image};
          
          var datetime = new Date();
          var timestamp = datetime.toISOString();

           //tracking user profile on mixpanel for usage purposes
           mixpanel.people.set(body.id, {
            "$name": body.display_name,    // only reserved properties need the $
            "$avatar" : image,
            "Sign up date": timestamp,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
            "USER_ID": body.id,    // use human-readable names
            "$email": body.email,
            "birthdate": body.birthdate,
            "country" : body.country,
            "plan" : 'free',
             
          });
         
          UserInfo = locUserInfo;
          locUserInfo = {};

        
          
        } catch (e) {
          let image = 'null';
          let locUserInfo = {name: body.display_name , id: body.id , email : body.email , dob : body.birthdate , country : body.country , product : body.product, image: image};
          //tracking user profile on mixpanel for usage purposes
          mixpanel.people.set(body.id, {
            "$name": body.display_name,    // only reserved properties need the $
            "$avatar" : image,
            "Sign up date": timestamp,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
            "USER_ID": body.id,    // use human-readable names
            "$email": body.email,
            "birthdate": body.birthdate,
            "country" : body.country,
            "plan" : 'free',
             
          });
          UserInfo = locUserInfo;
          locUserInfo = {};
        }



        });
      }catch(err) {
        console.log('Error accessing /me endpoint (003)', err);
        res.redirect('/#/error/Oops something went wrong! Error Code: (003)');
      }


          //getMySavedTracks endpoint data retrieval
          spotifyApi.getMySavedTracks().then(({ body }) => {

            let userSavedTracks_Track_Name = [];
            let userSavedTracks_Track_Id = [];
            let userSavedTracks_Track_Popularity = [];
            let userSavedTracks_Artist_Name = [];
            let userSavedTracks_Artist_Id = [];


            body.items.forEach(function(item) {
             userSavedTracks_Track_Name.push(item.track.name);
            });

            body.items.forEach(function(item) {
             userSavedTracks_Track_Id.push(item.track.id);
            });

            body.items.forEach(function(item) {
             userSavedTracks_Track_Popularity.push(item.track.popularity);
            });

            let t = [];

            body.items.forEach(function(item) {
              t.push(item.track.artists)
            });

            t.forEach(function(artist) {
              userSavedTracks_Artist_Name.push(artist[0].name)
            });

            t.forEach(function(artist) {
              userSavedTracks_Artist_Id.push(artist[0].id)
            });


            let items = [];
            let artist = [];

            for(let n = 0; n < userSavedTracks_Artist_Name.length; n++){
            artist[n] = {name : userSavedTracks_Artist_Name[n] , id : userSavedTracks_Artist_Id[n]};
            }


            for(let i = 0; i < userSavedTracks_Track_Name.length; i++){
            items[i] = {name : userSavedTracks_Track_Name[i] , id : userSavedTracks_Track_Id[i] , popularity: userSavedTracks_Track_Popularity[i] , artist : artist[i]};
            }

            let locSavedTracks = {items};
            SavedTracks = locSavedTracks;
            locSavedTracks = {};

            });

            //getMyTopTracks short term endpoint data retrieval
            spotifyApi.getMyTopTracks({ time_range : 'short_term', limit : 50}).then(({ body }) => {



                body.items.forEach(function(item) {
                 topSTracks_Track_Name.push(item.name);
                });

                body.items.forEach(function(item) {
                 topSTracks_Track_Id.push(item.id);
                });

                body.items.forEach(function(item) {
                 topSTracks_Track_Popularity.push(item.popularity);
                });

                let p = [];

                body.items.forEach(function(item) {
                 p.push(item.artists);
                });

                p.forEach(function(artist) {
                 topSTracks_Artist_Name.push(artist[0].name);
                });

                p.forEach(function(artist) {
                 topSTracks_Artist_Id.push(artist[0].id);
                });

              GBLARR1 = topSTracks_Artist_Id;

              });



            //getMyTopTracks medium term endpoint data retrieval
              spotifyApi.getMyTopTracks({ time_range : 'medium_term', limit : 50}).then(({ body }) => {



                  body.items.forEach(function(item) {
                   topMTracks_Track_Name.push(item.name);
                  });

                  body.items.forEach(function(item) {
                   topMTracks_Track_Id.push(item.id);
                  });

                  body.items.forEach(function(item) {
                   topMTracks_Track_Popularity.push(item.popularity);
                  });

                  let p = [];

                  body.items.forEach(function(item) {
                   p.push(item.artists);
                  });

                  p.forEach(function(artist) {
                   topMTracks_Artist_Name.push(artist[0].name);
                  });

                  p.forEach(function(artist) {
                   topMTracks_Artist_Id.push(artist[0].id);
                  });

                  GBLARR2 = topMTracks_Artist_Id;

              });


              //getMyTopTracks long term endpoint data retrieval
              spotifyApi.getMyTopTracks({ time_range : 'long_term', limit : 50}).then(({ body }) => {



                  body.items.forEach(function(item) {
                   topLTracks_Track_Name.push(item.name);
                  });

                  body.items.forEach(function(item) {
                   topLTracks_Track_Id.push(item.id);
                  });

                  body.items.forEach(function(item) {
                   topLTracks_Track_Popularity.push(item.popularity);
                  });

                  let p = [];

                  body.items.forEach(function(item) {
                   p.push(item.artists);
                  });

                  p.forEach(function(artist) {
                   topLTracks_Artist_Name.push(artist[0].name);
                  });

                  p.forEach(function(artist) {
                   topLTracks_Artist_Id.push(artist[0].id);
                  });

                  GBLARR3 = topLTracks_Artist_Id;

              });

              //getMyRecentlyPlayedTracks endpoint data retrieval
              spotifyApi.getMyRecentlyPlayedTracks().then(({ body }) => {

                let recentlyPlayed_Track_Name = [];
                let recentlyPlayed_Track_Id = [];
                let recentlyPlayed_Track_Popularity = [];
                let recentlyPlayed_Artist_Name = [];
                let recentlyPlayed_Artist_Id = [];
                let recentlyPlayed_Track_PlayedAt = [];

                body.items.forEach(function(item) {
                 recentlyPlayed_Track_Name.push(item.track.name);
                });

                body.items.forEach(function(item) {
                 recentlyPlayed_Track_Id.push(item.track.id);
                });

                body.items.forEach(function(item) {
                 recentlyPlayed_Track_Popularity.push(item.track.popularity);
                });

                let c = [];

                body.items.forEach(function(item) {
                 c.push(item.track.artists);
                });

                c.forEach(function(artist) {
                 recentlyPlayed_Artist_Name.push(artist[0].name);
                });

                c.forEach(function(artist) {
                 recentlyPlayed_Artist_Id.push(artist[0].id);
                });

                body.items.forEach(function(item) {
                 recentlyPlayed_Track_PlayedAt.push(item.played_at);
                });


                let items = [];
                let artist = [];

                for(let n = 0; n < recentlyPlayed_Artist_Name.length; n++){
                artist[n] = {name : recentlyPlayed_Artist_Name[n] , id : recentlyPlayed_Artist_Id[n]};
                }


                for(let i = 0; i < recentlyPlayed_Track_Name.length; i++){
                items[i] = {name : recentlyPlayed_Track_Name[i] , id : recentlyPlayed_Track_Id[i] , popularity: recentlyPlayed_Track_Popularity[i] , played_at: recentlyPlayed_Track_PlayedAt[i] , artist: artist[i]};
                }

                let locRecentlyPlayedTracks = {items};
                RecentlyPlayedTracks = locRecentlyPlayedTracks;
                locRecentlyPlayedTracks = {};

              });


            //refactor this code to get rid of timeout! Use await???

        setTimeout( function(){
      //send artist ids of topTracks s/m/l
        secondGet(GBLARR1, GBLARR2, GBLARR3, user, topSTracks_Track_Name, topSTracks_Track_Id, topSTracks_Track_Popularity, topSTracks_Artist_Name ,topSTracks_Artist_Id, topMTracks_Track_Name, topMTracks_Track_Id, topMTracks_Track_Popularity, topMTracks_Artist_Name, topMTracks_Artist_Id, topLTracks_Track_Name, topLTracks_Track_Id, topLTracks_Track_Popularity, topLTracks_Artist_Name, topLTracks_Artist_Id, RecentlyPlayedTracks, SavedTracks, UserInfo);
      }, 1000 );
    }

   async function secondGet(arr1, arr2, arr3, user, gblTopSTracks_Track_Name, gblTopSTracks_Track_Id, gblTopSTracks_Track_Popularity, gblTopSTracks_Artist_Name ,gblTopSTracks_Artist_Id, gblTopMTracks_Track_Name, gblTopMTracks_Track_Id, gblTopMTracks_Track_Popularity, gblTopMTracks_Artist_Name, gblTopMTracks_Artist_Id, gblTopLTracks_Track_Name, gblTopLTracks_Track_Id, gblTopLTracks_Track_Popularity, gblTopLTracks_Artist_Name, gblTopLTracks_Artist_Id, RecentlyPlayedTracks, SavedTracks, UserInfo) {


      spotifyApi.setAccessToken(user.accessToken);
      spotifyApi.setRefreshToken(user.refreshToken);

      let genres1 = [];
      let genres2 = [];
      let genres3 = [];



        spotifyApi.getArtists(arr1).then(({ body }) => {


          body.artists.forEach(function(artist) {
                genres1.push(artist.genres);
          });



       });

       spotifyApi.getArtists(arr2).then(({ body }) => {
         body.artists.forEach(function(artist) {
               genres2.push(artist.genres);
        });
      });

      spotifyApi.getArtists(arr3).then(({ body }) => {
        body.artists.forEach(function(artist) {
              genres3.push(artist.genres);
        });


     });



     setTimeout( function(){
       createProfile(genres1, genres2, genres3, user, gblTopSTracks_Track_Name, gblTopSTracks_Track_Id, gblTopSTracks_Track_Popularity, gblTopSTracks_Artist_Name ,gblTopSTracks_Artist_Id, gblTopMTracks_Track_Name, gblTopMTracks_Track_Id, gblTopMTracks_Track_Popularity, gblTopMTracks_Artist_Name, gblTopMTracks_Artist_Id, gblTopLTracks_Track_Name, gblTopLTracks_Track_Id, gblTopLTracks_Track_Popularity, gblTopLTracks_Artist_Name, gblTopLTracks_Artist_Id, RecentlyPlayedTracks, SavedTracks, UserInfo);


        mixpanel.track('User Registered', {
          distinct_id: user.id,
          name: UserInfo.name,
          country: UserInfo.country
        }); 
     }, 500 );




    }

    async function createProfile(g1, g2, g3, userObj, gblTopSTracks_Track_Name, gblTopSTracks_Track_Id, gblTopSTracks_Track_Popularity, gblTopSTracks_Artist_Name ,gblTopSTracks_Artist_Id, gblTopMTracks_Track_Name, gblTopMTracks_Track_Id, gblTopMTracks_Track_Popularity, gblTopMTracks_Artist_Name, gblTopMTracks_Artist_Id, gblTopLTracks_Track_Name, gblTopLTracks_Track_Id, gblTopLTracks_Track_Popularity, gblTopLTracks_Artist_Name, gblTopLTracks_Artist_Id, RecentlyPlayedTracks, SavedTracks, UserInfo) {

      //construct profile object
      let TopTracks_ShortTerm = {};
      let TopTracks_MediumTerm = {};
      let TopTracks_LongTerm = {};

      let items = [];
      let artist = [];

      for(let n = 0; n < gblTopSTracks_Artist_Name.length; n++){
      artist[n] = {name : gblTopSTracks_Artist_Name[n] , id : gblTopSTracks_Artist_Id[n] , genres : g1[n]};
      }


      for(let i = 0; i < gblTopSTracks_Track_Name.length; i++){
      items[i] = {name : gblTopSTracks_Track_Name[i] , id : gblTopSTracks_Track_Id[i] , popularity: gblTopSTracks_Track_Popularity[i] , artist : artist[i]};
      }

      let locTopTracks_ShortTerm = {items};
      TopTracks_ShortTerm = locTopTracks_ShortTerm;
      locTopTracks_ShortTerm = {};

      items = [];
      artist = [];

      for(let n = 0; n < gblTopMTracks_Artist_Name.length; n++){
      artist[n] = {name : gblTopMTracks_Artist_Name[n] , id : gblTopMTracks_Artist_Id[n] , genres : g2[n]};
      }


      for(let i = 0; i < gblTopMTracks_Track_Name.length; i++){
      items[i] = {name : gblTopMTracks_Track_Name[i] , id : gblTopMTracks_Track_Id[i] , popularity: gblTopMTracks_Track_Popularity[i] , artist : artist[i]};
      }

      let locTopTracks_MediumTerm = {items};
      TopTracks_MediumTerm = locTopTracks_MediumTerm;
      locTopTracks_MediumTerm = {};

      items = [];
      artist = [];

      for(let n = 0; n < gblTopLTracks_Artist_Name.length; n++){
      artist[n] = {name : gblTopLTracks_Artist_Name[n] , id : gblTopLTracks_Artist_Id[n] , genres : g3[n]};
      }


      for(let i = 0; i < gblTopLTracks_Track_Name.length; i++){
      items[i] = {name : gblTopLTracks_Track_Name[i] , id : gblTopLTracks_Track_Id[i] , popularity: gblTopLTracks_Track_Popularity[i] , artist : artist[i]};
      }

      let locTopTracks_LongTerm = {items};
      TopTracks_LongTerm = locTopTracks_LongTerm;
      locTopTracks_LongTerm = {};


      setTimeout( function(){


            let docRef = db.collection('users');
            let test = {id: UserInfo.id , name: UserInfo.name, image: UserInfo.image, TopTracks_ShortTerm , TopTracks_MediumTerm, TopTracks_LongTerm, SavedTracks, RecentlyPlayedTracks}
            console.log(TopTracks_LongTerm.items[1]);
            //create user profile
            let user = docRef.doc().set({id: UserInfo.id , name: UserInfo.name, image: UserInfo.image, TopTracks_ShortTerm , TopTracks_MediumTerm, TopTracks_LongTerm, SavedTracks, RecentlyPlayedTracks});
            //reset global variables after use
            UserInfo = {};
            SavedTracks = {};
            TopTracks_ShortTerm = {};
            TopTracks_MediumTerm = {};
            TopTracks_LongTerm = {};
            RecentlyPlayedTracks = {};
            console.log("\n ------------------------------------------------- \n SETLIST PROFILE CREATED! \n ------------------------------------------------- \n ");
            let urlQuery = querystring.stringify({
              'UID' : userObj.UID
            });
            let clientQuery = querystring.stringify({
              'sesh' : userObj.linkedSesh,
              'UID' : userObj.UID
            })

            if(userObj.role == 'host'){
              res.redirect(`/#/session/?` + urlQuery);
            } else {
              pushClientId(userObj.id, userObj.linkedSesh);
              res.redirect(`/#/loading/?` + clientQuery);
            }

        }, 1000 );
     }
   });
  };
});

  function pushHostId(seshId){
    //push HOST id to session collection for SESSION CONNECTION
    //getting the session id from the seshObject in the seshCollection
    let Session = seshCollection.sessions[seshId];
    console.log("SESSION", Session);

    // let SessionId = Session.seshObject.Id;
    console.log("SESSION ID ", seshId);
    let USER_ID = Session.host;
    let docRef = db.collection(seshId);


    let id = docRef.doc(USER_ID).set({id: USER_ID});
  }

  function pushClientId(userId, sesh){
    //push CLIENT id to session collection for SESSION CONNECTION


      let docRef = db.collection(sesh);

      let id = docRef.doc(userId).set({id: userId});
      //reset global variable
      // USER_ID = '';


  }

  app.get('/getSessionId', (req, res) => {
    var uid = req.query.UID;
    // create the session to the id can be used in the redirect
    var ids = createSession(uid);
    let hostId = ids.hostId;
    let SessionId = ids.seshId;
    pushHostId(SessionId);
    socket.emit("host", hostId);
    // console.log("\n http://localhost:3000/false/" + SessionId + "\n");
    socket.join(SessionId);
    res.redirect(`/#/config-setlist/${hostId}/${SessionId}/${uid}`);

  });



  app.get('/setConfigParams', (req, res) => {
    //add more params to config screen to inject into engine
      let locSetlistName = '';
      let locSessionName = '';
      let selectedGenre = req.query.genre.toLowerCase();


      console.log(selectedGenre);

      if(req.query.setlistName === '' || undefined || null){
        locSetlistName = 'My Setlist';
        // setlistName = locSetlistName;
        // locSetlistName = '';
      }else {
        locSetlistName = req.query.setlistName;
        // setlistName = locSetlistName;
        // locSetlistName = '';
      }

      // if(req.query.sessionName === '' || undefined || null){
      //   locSessionName = 'My Session';
      //   // sessionName = locSessionName;
      //   // locSessionName = '';
      // }else {
      //   locSessionName = req.query.sessionName;
      //   // sessionName = locSessionName;
      //   // locSessionName = '';
      // }

      let query = querystring.stringify({
        'host': req.query.host,
        'sesh': req.query.sesh,
        'uid' : req.query.uid,
        'genre' : selectedGenre,
        'name' : locSetlistName
      });


    res.redirect(`/run-engine/?` + query);

  });






app.get('/run-engine', (req, res) => {
  spotifyApi.getMe().then(({ body }) => {
    console.log("(((((((((((((((((((((((((((((((((((((((((((((((((SECOND GETME)))))))))))))))))))))))))))))))))", body.id);
  })

  console.log("--------------------------------- \nRunning Engine\n---------------------------------");
  var hostId = req.query.host;
  let uid = req.query.uid;
  var sesh = req.query.sesh; // will use sesh for an emit message to the socket room that was created under the same name as the sesh ID
  var selectedGenre = req.query.genre;
  let setlistName = req.query.name;
  console.log(hostId);
  let user = masterUsers[uid];


  //removed the getMe() because there seemed to be a problem with the wrong information being requested.
  var len = masterUsers.length;
  spotifyApi.setAccessToken(user.accessToken);
  spotifyApi.setRefreshToken(user.refreshToken);
  accessDb(hostId, sesh, selectedGenre);


  // spotifyApi.setAccessToken(gblHostAccessToken);
  // spotifyApi.setRefreshToken(gblHostRefreshToken);



//Setlist Engine V0.0.2.2 =====>

function accessDb(host, seshId, selectedGenre) {
  // let Session = seshCollection.sessions.find(i => i.socket = socket);
  // let SessionId = Session.seshObject.Id;

  console.time("Engine Run Time");

  let userIds = [];

  //first get all docs and and set count variable
    let sessionRef = db.collection(seshId);


  let getUsers = sessionRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
       userIds.push(doc.id);
    });
    sendSessionIds(userIds, host, selectedGenre, seshId);
  })

}



  //loop through user ids present in the session and pull their profile -
  //then populate data array

  async function sendSessionIds(userIds, host, selectedGenre, seshId){


      let docRef = db.collection("users");
      let userData = [];

      
      console.log("\n \n \n \n \n \n \n \n \n \n \n");
      console.log(user.id);
      console.log("\n \n \n \n \n \n \n \n \n \n \n");

      mixpanel.track('Invited Friends', {
        distinct_id: user.id,
        session_members: userIds,
        member_count: userIds.length
      });


    console.log("Session Members: " + userIds + " /// No. of Session Members: " + userIds.length);


      for (let i = 0; i < userIds.length; i++){
          let query = await docRef.where('id', '==', userIds[i]).get()
          .then(snapshot => {
          if (snapshot.empty) {
            console.log('Error getting documents (019)', err);
            res.redirect('/#/error/Oops something went wrong! Error Code: (019)');
            return;
          } else {
            snapshot.forEach(doc => {
            userData.push(doc.data());
            })
           }
         });
       }
       console.log("(((((((((((((((((((((ABOUT TO SENDDATA))))))))))))))", userData, host);

      sendData(userData, host, selectedGenre, seshId);
 }



 async function sendData(data, host, selectedGenre, seshId){

   /**
     * Check if user has data in the TopTracks_ShortTerm object,
     * If not - then check to see if user has data in the TopTracks_MediumTerm object
     * If not - then check to see if user has data in the TopTracks_LongTerm object
     * If not - then check to see if user has data in the RecentlyPLayedTracks object
     * If not - then don't use user's data and delete them
     */


//Input data validation
var users = [];
var tracks = {};
var len = data.length;

  for(let i = 0; i < len; i++){

    // if(data[i].TopTracks_ShortTerm.items === undefined || data[i].TopTracks_ShortTerm.items.length == 0 ||  data[i].TopTracks_ShortTerm.items === []){
    //   console.log("User " + i + " has no data in TopTracks_ShortTerm");

    if(data[i].TopTracks_MediumTerm.items == undefined || data[i].TopTracks_MediumTerm.items.length == 0 ||  data[i].TopTracks_MediumTerm.items == []){
      console.log("User " + i + " has no data in TopTracks_MediumTerm");

      if(data[i].TopTracks_LongTerm.items == undefined || data[i].TopTracks_LongTerm.items.length == 0 ||  data[i].TopTracks_LongTerm.items == []){
        console.log("User " + i + " has no data in TopTracks_LongTerm");

        // if(data[i].RecentlyPlayedTracks.items == undefined || data[i].RecentlyPlayedTracks.items == 0 ||  data[i].RecentlyPlayedTracks.items == []){
        //   console.log("User " + i + " has no data in RecentlyPlayedTracks, ignore them.");
        //   delete data[i]
        // }else if(data[i].RecentlyPlayedTracks.items !== undefined || data[i].RecentlyPlayedTracks.items != 0 ||  data[i].RecentlyPlayedTracks.items !== []){
        //    users.push(data[i].RecentlyPlayedTracks);
        //    console.log("User " + i + " has data in RecentlyPlayedTracks");
        // }else{
        //   console.log("Input Data Error");
        // }
      }else if(data[i].TopTracks_LongTerm.items !== undefined || data[i].TopTracks_LongTerm.items.length != 0 ||  data[i].TopTracks_LongTerm.items !== []){
         users.push(data[i].TopTracks_LongTerm);
         console.log("User " + i + " has data in TopTracks_LongTerm");
      }else{
        console.log("Input Data Error");
      }
    }else if(data[i].TopTracks_MediumTerm.items !== undefined || data[i].TopTracks_MediumTerm.items.length != 0 ||  data[i].TopTracks_MediumTerm.items !== []){
       users.push(data[i].TopTracks_MediumTerm);
       console.log("User " + i + " has data in TopTracks_MediumTerm");
    }else{
      console.log("Input Data Error");
    }
  // }else if(data[i].TopTracks_ShortTerm.items !== undefined || data[i].TopTracks_ShortTerm.items.length != 0 ||  data[i].TopTracks_ShortTerm.items !== []){
  //    users.push(data[i].TopTracks_ShortTerm);
  //    console.log("User " + i + " has data in TopTracks_ShortTerm");
  // }else{
  //   console.log("Input Data Error");
  // }
  }
  console.log("(((((((((((((((((((((ABOUT TO generateSetlist))))))))))))))", users, host);
    generateSetlist(users, host, selectedGenre, seshId);
    //clearing the users array for other sessions
    // users = [];

}



function generateSetlist(users, host, selectedGenre, seshId) {

/*
* Problem here if a user does not have short term tracks, because right now it looks for itemsS.
* need a way to change the key name to something more ubiquitous or something
*/
let finalSet = [];
let trackDict = {};
let count = 0;
    console.log("----------------------------GENERATE SETLIST---------------------------");
      // iterating through the users array
      var len = users.length;
      for (var i = 0; i < len; i++){
        // iterating through the tracks for each user
        let len2 = Object.keys(users[0].items).length;
        for (var j = 0; j < len2; j++){
          // check if the current track's genres contains the string for the genre entered by the user
          if(users[i].items[j].artist.genres.indexOf(selectedGenre) > -1){
            // Checking here first if this track has already been added to the setlist (eliminating duplicates)
            if(!(users[i].items[j].id in trackDict)){
              // if not, add the track name to the track dictionary with a score of 0
              // count++;
              trackDict[users[i].items[j].id] = 0;
            }
            // else, a duplicate has been detected, meaning more than one user listens to this song
            else {
              // increment the score for this song
              var score  = trackDict[users[i].items[j].id];
              score++;
              trackDict[users[i].items[j].id] = score;
            }
          }
          // else check if the current track's genres contain substrings of the genre entered by the user
          else if(users[i].items[j].artist.genres.find(a =>a.includes(selectedGenre  + new Array(0).join(' ')))){
            // Checking here first if this track has already been added to the setlist (eliminating duplicates)
            if(!(users[i].items[j].id in trackDict)){
              // if not, add the track name to the tack dictionary with a score of 0
              // count++;
              trackDict[users[i].items[j].id] = 0;
            }
            // else, a duplicate has been detected, meaning more than one user listens to this song
            else {
              // increment the score for this song
              var score  = trackDict[users[i].items[j].id];
              score++;
              trackDict[users[i].items[j].id] = score;
            }
          }
        }
      }

      // create an array based on the keys and values of the trackDict dictionary
      var sortedTracks = Object.keys(trackDict).map(function(key) {
        return [key, trackDict[key]];
      });

      // shuffling the array initially to diversify the pool of tracks that have a score of 0
      shuffle(sortedTracks);

      // Sort the array based on the second element, which was previously the score value in the dictionary pair, to allow the most common tracks among the users to play first
      sortedTracks.sort(function(el1, el2) {
        return el2[1] - el1[1];
      });


      // logging the sorted array
      //console.log(sortedTracks);

      // iterate through the sortedtracks array and push the track names to the finalSet array
      var len3 = sortedTracks.length;
      for(var t = 0;  t < len3; t++){
        finalSet.push(pfx + sortedTracks[t][0]);
      }

      console.log(trackDict);


    createSetlist(host, finalSet, seshId);


}
function createSetlist(host, finalSet, seshId){
  console.log("HOST ID = ", host );
  console.log();
  var currTime = moment().format();
  var difference = moment(currTime).diff(user.access_time, 'seconds');
  if (difference >= 3600){
    console.log("ACCESS TOKEN EXPIRED... REFRESHING");

    spotifyApi.setRefreshToken(user.refreshToken);
    spotifyApi.refreshAccessToken().then( data => {
      user.accessToken = data.body.access_token;
      user.refreshToken = data.body.refresh_token;
    });
  }

  // let hostObj = null;

  // //using the host id that has been passed along the functions to this point so we can access the tokens associated with that user
  // for(var i = 0; i<masterUsers.length; i++ ){
  //   if( masterUsers[i].id == host && masterUsers[i].role == 'host'){
  spotifyApi.setAccessToken(user.accessToken);
  spotifyApi.setRefreshToken(user.refreshToken);
  //     hostObj = masterUsers[i];
  //   }
  // }

  // spotifyApi.setAccessToken(gblHostAccessToken);
  // spotifyApi.setRefreshToken(gblHostRefreshToken);


      spotifyApi.createPlaylist(host, setlistName, { 'public' : true })
      .then(function(data) {
        console.log('Setlist Seeded');
        mixpanel.track('Setlist Created', {
          distinct_id: user.id,
          setlist_name: setlistName,
          selected_genre: selectedGenre,
        });
        getSetlistId(user, finalSet, seshId);
      }, function(err) {
        console.log('Something went wrong!', err);
      });



}

async function getSetlistId(host, finalSet, seshId) {

var playlistId = null;
      let seeding = spotifyApi.getUserPlaylists(host.id , {limit: 1 , offset: 0}).then(({ body }) =>{
        console.log("CATCH 1");

        playlistId = body.items[0].id;
        // addTracksToSetlist();
      });
      await Promise.all([seeding]);
      console.log("CATCH 2");

      addTracksToSetlist(host, playlistId, finalSet, seshId);

  }
async function addTracksToSetlist(host, playlistId, finalSet, seshId) {
  console.log("CATCH 3");

  await spotifyApi.setAccessToken(host.accessToken);
  await spotifyApi.setRefreshToken(host.refreshToken);

  console.log("CATCH 4");
  console.log("---------------HOST ID---", host);
  console.log("---------------Playlist ID---", playlistId);
  console.log("---------------FINAL SET---", finalSet);




  await spotifyApi.addTracksToPlaylist(host.id, playlistId, finalSet).then(({ body }) =>{
    console.log("CATCH 5");
    console.log('Setlist Created!');
    var link = `/#/play-setlist/${host.id}/${playlistId}`;
    console.log("((((((((((((((SESSION COMPLETE)))))))))");
    console.log(seshCollection.sessions);
    delete seshCollection.sessions[seshId]
    console.log(seshCollection.sessions);
    seshCollection.totalSeshCount -=1;
    console.log(seshCollection);
    
    
    socket.to(seshId).emit('update-sesh-members', link);
    res.redirect(link+'/'+ uid);
    return;
  }).catch(err =>{
     `ERROR =>  ${err}`;
     var link='/#/error/Oops something went wrong! Error Code: (019)'
     socket.to(seshId).emit('update-sesh-members', link);
     res.redirect(link);
     console.log("-------------ERROR-------->", err);
     return;
    });

}


/*
* function to shuffle an array to diversify the setlist order for tracks that have a score of 0
*/
function shuffle(array) {


    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;


  }

});

});

module.exports = app, router;

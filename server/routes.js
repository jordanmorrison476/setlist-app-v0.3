// //use strict??//use strict??

// require("./app.js").io;
// const Spotify = require('spotify-web-api-node');
// const querystring = require('querystring');
// const express = require('express');
// const router = new express.Router();
// const async = require('async');
// const admin = require('firebase-admin');
// const {Firestore} = require('@google-cloud/firestore');
// const serviceAccount = require('../serviceAccountKey.json');
// const firestore = new Firestore();
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// firestore.settings(settings);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// let db = admin.firestore();

// /** Generates a random string containing numbers and letters of N characters */
// const generateRandomString = N => ((Math.random()+1).toString(36)+Array(N).join('0')).slice(2, N+2);
// const pfx = 'spotify:track:';


// //declare endpoint objects for json formatting
// let UserInfo = {};
// let SavedTracks = {};
// let TopArtists_ShortTerm = {};
// let TopArtists_MediumTerm = {};
// let TopArtists_LongTerm = {};
// let TopTracks_ShortTerm = {};
// let TopTracks_MediumTerm = {};
// let TopTracks_LongTerm = {};
// let RecentlyPlayedTracks = {};
// let Obj = {}; //json object
// let hostObj = {}; //json object
// let SessionId = '';


// //global variables
// let topSTracks_Track_Id = [];
// let setlistName = '';
// let sessionName = '';
// let gblHost_Id = '';
// let gblPlaylistId = '';
// let dupSetlist = [];
// let gblSetlist = [];
// let gblAccessToken = '';
// let gblRefreshToken = '';
// let gblHostAccessToken = '';
// let gblHostRefreshToken = '';
// let users = [];
// let tracks = [];
// let param1 = '';
// let param2 = '';
// let param3 = '';
// let param4 = '';
// let param5 = '';
// let selectedGenre;
// let trackDict = {};
// let count = 0;
// let finalSet = [];


// let GBLARR1 = [];
// let GBLARR2 = [];
// let GBLARR3 = [];

// let gblTopSTracks_Artist_Name = [];
// let gblTopSTracks_Artist_Id = [];
// let gblTopSTracks_Track_Name = [];
// let gblTopSTracks_Track_Id = [];
// let gblTopSTracks_Track_Popularity = [];

// let gblTopMTracks_Artist_Name = [];
// let gblTopMTracks_Artist_Id = [];
// let gblTopMTracks_Artist_IdTracks_Track_Name = [];
// let gblTopMTracks_Track_Id = [];
// let gblTopMTracks_Track_Popularity = [];

// let gblTopLTracks_Artist_Name = [];
// let gblTopLTracks_Artist_Id = [];
// let gblTopLTracks_Track_Name = [];
// let gblTopLTracks_Track_Id = [];
// let gblTopLTracks_Track_Popularity = [];


// // configure the express server
// const CLIENT_ID = process.env.id;
// const CLIENT_SECRET = process.env.secret;
// const REDIRECT_URI = process.env.redirect_uri || 'http://localhost:3000/callback';
// const STATE_KEY = 'spotify_auth_state';
// let SESSION_ID = '';
// let HOST = true;
// let USER_ID = '';
// // your application requests authorization
// const scopes = ['user-read-private', 'user-read-email','user-read-birthdate', 'user-library-read', 'playlist-read-private' , 'user-top-read', 'user-read-recently-played' , 'playlist-modify-public' ,  'playlist-modify-private'];

// // configure spotify
// const spotifyApi = new Spotify({
//   clientId: 'e3a7bc8295f244d392babe0bcbe65454',
//   clientSecret: 'e82cc74ec6b142539212c9ee91f50907',
//   redirectUri: 'http://localhost:3000/callback',
//   // 'https://setlistwebapp.herokuapp.com/callback',
//   //make sure dev redirect uri isn't pushed to master!!!!
// });

// /**
//  * CHECK IF  OR HOST
//  */

// //redirect to root of the application and pick up parameters from the header
// router.get('/:host/:sessionId', function(req, res) {
//     SESSION_ID = req.params.sessionId;
//     HOST = req.params.host;
//     console.log(SESSION_ID);
//     //redirect to root after param collection
//     res.redirect(`/`)
// });

// /**
//  *END CHECK IF  OR HOST
//  */

// /**
//  * The /login endpoint
//  * Redirect the let  to the spotify authorize url, but first set that user's
//  * state in the cookie.
//  */
// router.get('/login', (_, res) => {
//   const state = generateRandomString(8);
//   res.cookie(STATE_KEY, state);
//   res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
// });

// /**
//  * The /callback endpoint - hit after the user logs in to spotifyApi
//  * Verify that the state we put in the cookie matches the state in the query
//  * parameter. Then, if all is good, redirect the user to the user page. If all
//  * is not good, redirect the user to an error page
//  */
// router.get('/callback', (req, res) => {
//   req.app.io.emit('log in success');
//   const { code, state } = req.query;
//   const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
//   // first do state validation
//   if (state === null || state !== storedState) {
//     console.log('State mismatch (001)');
//     res.redirect('/#/error/Oops something went wrong! Error Code: (001)');
//   // if the state is valid, get the authorization code and pass it on to the client
//   } else {
//     res.clearCookie(STATE_KEY);
//     // Retrieve an access token and a refresh token
//     spotifyApi.authorizationCodeGrant(code).then(data => {
//       const { expires_in, access_token, refresh_token } = data.body;


//     // Set the access token on the API object to use it in later calls
//     spotifyApi.setAccessToken(access_token);
//     spotifyApi.setRefreshToken(refresh_token);


//     // Globalise tokens to use in different function scopes
//     gblAccessToken = access_token;
//     gblRefreshToken = refresh_token;



//     async.waterfall([
//     checkIfRegistered,
//     firstGet,
//     secondGet,
//     createProfile,
//     ], function (err, result) {
//         // result now equals 'done'
//         if(err){
//           throw err;
//         }else{
//           if(HOST === true){
//             res.redirect(`/#/session`);
//           } else {
//             pushClientId();
//             //reset global variable
//             HOST = true;
//             res.redirect(`/#/loading`);
//           }
//         }
//     });

//     /**
//       * Check if the user is a registered Setlist user by matching MSS id to a user on the dB
//       * IF not a registered user, create their profile
//       *
//       */

//     function checkIfRegistered(callback){

//       spotifyApi.getMe().then(({ body }) => {
//         if (HOST === true){
//           gblHost_Id = body.id;
//           gblHostAccessToken = gblAccessToken;
//           gblHostRefreshToken = gblAccessToken;
//         }

//           USER_ID = body.id;
//           sendId(body.id);

//       });

//       function sendId(id){

//           let docRef = db.collection('users');
//           let query = docRef.where('id', '==', id).get()
//           .then(snapshot => {
//           if (snapshot.empty) {
//             console.log('\n ------------------------------------------------- \n The user is not registered, create Setlist profile \n ------------------------------------------------- \n');
//             if (HOST === true){
//                console.log("\n ------------------------------------------------- \n THE USER IS A HOST. \n ------------------------------------------------- \n ");
//                let locSessionId = generateRandomString(11);
//                SessionId = locSessionId;
//                locSessionId = '';
//                callback(null);
//             } else {
//                 console.log("\n ------------------------------------------------- \n THE USER IS NOT A HOST \n ------------------------------------------------- \n ");
//                 callback(null);
//           }
//         }else{
//           console.log("\n ------------------------------------------------- \n The user is registered, log them in. \n ------------------------------------------------- \n ");
//           if (HOST === true){
//              console.log("\n ------------------------------------------------- \n THE USER IS A HOST \n ------------------------------------------------- \n ");
//              let locSessionId = generateRandomString(11);
//              SessionId = locSessionId;
//              console.log(SessionId);
//              locSessionId = '';
//              res.redirect(`/#/session`);
//           } else {
//                console.log("\n ------------------------------------------------- \n THE USER IS NOT A HOST \n ------------------------------------------------- \n ");
//                pushClientId();
//                //reset global variable
//                HOST = true;
//                res.redirect(`/#/loading`);
//           }
//          }
//         })
//       }
//     }

//     function firstGet(callback) {
//       spotifyApi.setAccessToken(gblAccessToken);
//       spotifyApi.setRefreshToken(gblRefreshToken);



//         //getMe endpoint data retrieval
//         spotifyApi.getMe().then(({ body }) => {
//           let locUserInfo = {name: body.display_name , id: body.id , email : body.email , dob : body.birthdate , country : body.country , product : body.product};
//           UserInfo = locUserInfo;
//           locUserInfo = {};
//         });

//       try{
//         //getMe endpoint data retrieval
//         spotifyApi.getMe().then(({ body }) => {
//           let locUserInfo = {name: body.display_name , id: body.id , email : body.email , dob : body.birthdate , country : body.country , product : body.product};
//           UserInfo = locUserInfo;
//           locUserInfo = {};
//         });
//       }catch(err) {
//         console.log('Error accessing /me endpoint (003)', err);
//         res.redirect('/#/error/Oops something went wrong! Error Code: (003)');
//       }


//           //getMySavedTracks endpoint data retrieval
//           spotifyApi.getMySavedTracks().then(({ body }) => {

//             let userSavedTracks_Track_Name = [];
//             let userSavedTracks_Track_Id = [];
//             let userSavedTracks_Track_Popularity = [];
//             let userSavedTracks_Artist_Name = [];
//             let userSavedTracks_Artist_Id = [];


//             body.items.forEach(function(item) {
//              userSavedTracks_Track_Name.push(item.track.name);
//             });

//             body.items.forEach(function(item) {
//              userSavedTracks_Track_Id.push(item.track.id);
//             });

//             body.items.forEach(function(item) {
//              userSavedTracks_Track_Popularity.push(item.track.popularity);
//             });

//             let t = [];

//             body.items.forEach(function(item) {
//               t.push(item.track.artists)
//             });

//             t.forEach(function(artist) {
//               userSavedTracks_Artist_Name.push(artist[0].name)
//             });

//             t.forEach(function(artist) {
//               userSavedTracks_Artist_Id.push(artist[0].id)
//             });


//             let items = [];
//             let artist = [];

//             for(let n = 0; n < userSavedTracks_Artist_Name.length; n++){
//             artist[n] = {name : userSavedTracks_Artist_Name[n] , id : userSavedTracks_Artist_Id[n]};
//             }


//             for(let i = 0; i < userSavedTracks_Track_Name.length; i++){
//             items[i] = {name : userSavedTracks_Track_Name[i] , id : userSavedTracks_Track_Id[i] , popularity: userSavedTracks_Track_Popularity[i] , artist : artist[i]};
//             }

//             let locSavedTracks = {items};
//             SavedTracks = locSavedTracks;
//             locSavedTracks = {};

//             });

//             //getMyTopTracks short term endpoint data retrieval
//             spotifyApi.getMyTopTracks({ time_range : 'short_term', limit : 50}).then(({ body }) => {

//               let topSTracks_Track_Name = [];
//               let topSTracks_Track_Id = [];
//               let topSTracks_Track_Popularity = [];
//               let topSTracks_Artist_Name = [];
//               let topSTracks_Artist_Id = [];

//                 body.items.forEach(function(item) {
//                  topSTracks_Track_Name.push(item.name);
//                 });

//                 body.items.forEach(function(item) {
//                  topSTracks_Track_Id.push(item.id);
//                 });

//                 body.items.forEach(function(item) {
//                  topSTracks_Track_Popularity.push(item.popularity);
//                 });

//                 let p = [];

//                 body.items.forEach(function(item) {
//                  p.push(item.artists);
//                 });

//                 p.forEach(function(artist) {
//                  topSTracks_Artist_Name.push(artist[0].name);
//                 });

//                 p.forEach(function(artist) {
//                  topSTracks_Artist_Id.push(artist[0].id);
//                 });

//                gblTopSTracks_Artist_Name = topSTracks_Artist_Name;
//                gblTopSTracks_Artist_Id = topSTracks_Artist_Id;
//                gblTopSTracks_Track_Name = topSTracks_Track_Name;
//                gblTopSTracks_Track_Id = topSTracks_Track_Id;
//                gblTopSTracks_Track_Popularity = topSTracks_Track_Popularity;

//               GBLARR1 = topSTracks_Artist_Id;

//               });



//             //getMyTopTracks medium term endpoint data retrieval
//               spotifyApi.getMyTopTracks({ time_range : 'medium_term', limit : 50}).then(({ body }) => {

//                 let topMTracks_Track_Name = [];
//                 let topMTracks_Track_Id = [];
//                 let topMTracks_Track_Popularity = [];
//                 let topMTracks_Artist_Name = [];
//                 let topMTracks_Artist_Id = [];

//                   body.items.forEach(function(item) {
//                    topMTracks_Track_Name.push(item.name);
//                   });

//                   body.items.forEach(function(item) {
//                    topMTracks_Track_Id.push(item.id);
//                   });

//                   body.items.forEach(function(item) {
//                    topMTracks_Track_Popularity.push(item.popularity);
//                   });

//                   let p = [];

//                   body.items.forEach(function(item) {
//                    p.push(item.artists);
//                   });

//                   p.forEach(function(artist) {
//                    topMTracks_Artist_Name.push(artist[0].name);
//                   });

//                   p.forEach(function(artist) {
//                    topMTracks_Artist_Id.push(artist[0].id);
//                   });

//                   gblTopMTracks_Artist_Name = topMTracks_Artist_Name;
//                   gblTopMTracks_Artist_Id = topMTracks_Artist_Id;
//                   gblTopMTracks_Track_Name = topMTracks_Track_Name;
//                   gblTopMTracks_Track_Id = topMTracks_Track_Id;
//                   gblTopMTracks_Track_Popularity = topMTracks_Track_Popularity;

//                   GBLARR2 = topMTracks_Artist_Id;

//               });


//               //getMyTopTracks long term endpoint data retrieval
//               spotifyApi.getMyTopTracks({ time_range : 'long_term', limit : 50}).then(({ body }) => {

//                 let topLTracks_Track_Name = [];
//                 let topLTracks_Track_Id = [];
//                 let topLTracks_Track_Popularity = [];
//                 let topLTracks_Artist_Name = [];
//                 let topLTracks_Artist_Id = [];

//                   body.items.forEach(function(item) {
//                    topLTracks_Track_Name.push(item.name);
//                   });

//                   body.items.forEach(function(item) {
//                    topLTracks_Track_Id.push(item.id);
//                   });

//                   body.items.forEach(function(item) {
//                    topLTracks_Track_Popularity.push(item.popularity);
//                   });

//                   let p = [];

//                   body.items.forEach(function(item) {
//                    p.push(item.artists);
//                   });

//                   p.forEach(function(artist) {
//                    topLTracks_Artist_Name.push(artist[0].name);
//                   });

//                   p.forEach(function(artist) {
//                    topLTracks_Artist_Id.push(artist[0].id);
//                   });


//                   gblTopLTracks_Artist_Name = topLTracks_Artist_Name;
//                   gblTopLTracks_Artist_Id = topLTracks_Artist_Id;
//                   gblTopLTracks_Track_Name = topLTracks_Track_Name;
//                   gblTopLTracks_Track_Id = topLTracks_Track_Id;
//                   gblTopLTracks_Track_Popularity = topLTracks_Track_Popularity;

//                   GBLARR3 = topLTracks_Artist_Id;
//               });

//                 let recentlyPlayed_Track_Name = [];
//                 let recentlyPlayed_Track_Id = [];
//                 let recentlyPlayed_Track_Popularity = [];
//                 let recentlyPlayed_Artist_Name = [];
//                 let recentlyPlayed_Artist_Id = [];
//                 let recentlyPlayed_Track_PlayedAt = [];

//               //getMyRecentlyPlayedTracks endpoint data retrieval
//               spotifyApi.getMyRecentlyPlayedTracks().then(({ body }) => {

//                 let recentlyPlayed_Track_Name = [];
//                 let recentlyPlayed_Track_Id = [];
//                 let recentlyPlayed_Track_Popularity = [];
//                 let recentlyPlayed_Artist_Name = [];
//                 let recentlyPlayed_Artist_Id = [];
//                 let recentlyPlayed_Track_PlayedAt = [];

//                 body.items.forEach(function(item) {
//                  recentlyPlayed_Track_Name.push(item.track.name);
//                 });

//                 body.items.forEach(function(item) {
//                  recentlyPlayed_Track_Id.push(item.track.id);
//                 });

//                 body.items.forEach(function(item) {
//                  recentlyPlayed_Track_Popularity.push(item.track.popularity);
//                 });

//                 let c = [];

//                 body.items.forEach(function(item) {
//                  c.push(item.track.artists);
//                 });

//                 c.forEach(function(artist) {
//                  recentlyPlayed_Artist_Name.push(artist[0].name);
//                 });

//                 c.forEach(function(artist) {
//                  recentlyPlayed_Artist_Id.push(artist[0].id);
//                 });

//                 body.items.forEach(function(item) {
//                  recentlyPlayed_Track_PlayedAt.push(item.played_at);
//                 });


//                 let items = [];
//                 let artist = [];

//                 for(let n = 0; n < recentlyPlayed_Artist_Name.length; n++){
//                 artist[n] = {name : recentlyPlayed_Artist_Name[n] , id : recentlyPlayed_Artist_Id[n]};
//                 }


//                 for(let i = 0; i < recentlyPlayed_Track_Name.length; i++){
//                 items[i] = {name : recentlyPlayed_Track_Name[i] , id : recentlyPlayed_Track_Id[i] , popularity: recentlyPlayed_Track_Popularity[i] , played_at: recentlyPlayed_Track_PlayedAt[i] , artist: artist[i]};
//                 }

//                 let locRecentlyPlayedTracks = {items};
//                 RecentlyPlayedTracks = locRecentlyPlayedTracks;
//                 locRecentlyPlayedTracks = {};

//               });


//             //refactor this code to get rid of timeout! Use await???

//         setTimeout( function(){
//       //send artist ids of topTracks s/m/l
//         callback(null, GBLARR1, GBLARR2, GBLARR3);
//       }, 500 );
//     }

//     function secondGet(callback, arr1, arr2, arr3) {

//       spotifyApi.setAccessToken(gblAccessToken);
//       spotifyApi.setRefreshToken(gblRefreshToken);
//       let genres1 = [];
//       let genres2 = [];
//       let genres3 = [];



//         spotifyApi.getArtists(GBLARR1).then(({ body }) => {
//           body.artists.forEach(function(artist) {
//             genres1.push(artist.genres);
//           });
//        });

//        spotifyApi.getArtists(GBLARR2).then(({ body }) => {
//          body.artists.forEach(function(artist) {
//            genres2.push(artist.genres);
//          });
//       });

//       spotifyApi.getArtists(GBLARR3).then(({ body }) => {
//         body.artists.forEach(function(artist) {
//           genres3.push(artist.genres);
//         });
//      });



//      setTimeout( function(){
//        createProfile(null, genres1, genres2, genres3);
//      }, 500 );




//     }

//     function createProfile(callback, g1, g2, g3) {

//       //construct profile object

//       let itemsS = [];
//       let artistS = [];

//       for(let n = 0; n < gblTopSTracks_Artist_Name.length; n++){
//       artistS[n] = {name : gblTopSTracks_Artist_Name[n] , id : gblTopSTracks_Artist_Id[n] , genres : g1[n]};
//       }


//       for(let i = 0; i < gblTopSTracks_Track_Name.length; i++){
//       itemsS[i] = {name : gblTopSTracks_Track_Name[i] , id : gblTopSTracks_Track_Id[i] , popularity: gblTopSTracks_Track_Popularity[i] , artist : artistS[i]};
//       }

//       let locTopTracks_ShortTerm = {itemsS};
//       TopTracks_ShortTerm = locTopTracks_ShortTerm;
//       locTopTracks_ShortTerm = {};

//       let itemsM = [];
//       let artistM = [];

//       for(let n = 0; n < gblTopMTracks_Artist_Name.length; n++){
//       artistM[n] = {name : gblTopMTracks_Artist_Name[n] , id : gblTopMTracks_Artist_Id[n] , genres : g2[n]};
//       }


//       for(let i = 0; i < gblTopMTracks_Track_Name.length; i++){
//       itemsM[i] = {name : gblTopMTracks_Track_Name[i] , id : gblTopMTracks_Track_Id[i] , popularity: gblTopMTracks_Track_Popularity[i] , artist : artistM[i]};
//       }

//       let locTopTracks_MediumTerm = {itemsM};
//       TopTracks_MediumTerm = locTopTracks_MediumTerm;
//       locTopTracks_MediumTerm = {};

//       let itemsL = [];
//       let artistL = [];

//       for(let n = 0; n < gblTopLTracks_Artist_Name.length; n++){
//       artistL[n] = {name : gblTopLTracks_Artist_Name[n] , id : gblTopLTracks_Artist_Id[n] , genres : g3[n]};
//       }


//       for(let i = 0; i < gblTopLTracks_Track_Name.length; i++){
//       itemsL[i] = {name : gblTopLTracks_Track_Name[i] , id : gblTopLTracks_Track_Id[i] , popularity: gblTopLTracks_Track_Popularity[i] , artist : artistL[i]};
//       }

//       let locTopTracks_LongTerm = {itemsL};
//       TopTracks_LongTerm = locTopTracks_LongTerm;
//       locTopTracks_LongTerm = {};



//       setTimeout( function(){


//             let docRef = db.collection('users');
//             //create user profile
//             let user = docRef.doc().set({id: UserInfo.id , name: UserInfo.name , TopTracks_ShortTerm , TopTracks_MediumTerm, TopTracks_LongTerm, SavedTracks, RecentlyPlayedTracks});
//             //reset global variables after use
//             UserInfo = {};
//             SavedTracks = {};
//             TopTracks_ShortTerm = {};
//             TopTracks_MediumTerm = {};
//             TopTracks_LongTerm = {};
//             RecentlyPlayedTracks = {};
//             console.log("\n ------------------------------------------------- \n SETLIST PROFILE CREATED! \n ------------------------------------------------- \n ");

//             if(HOST === true){
//               res.redirect(`/#/session`);
//             } else {
//               pushClientId();
//               //reset global variable
//               HOST = true;
//               res.redirect(`/#/loading`);
//             }

//         }, 1000 );
//      }
//    });
//   };
// });

//   function pushHostId(){
//     //push HOST id to session collection for SESSION CONNECTION

//     console.log(SessionId);

//       let docRef = db.collection(SessionId);


//       let id = docRef.doc(USER_ID).set({id: USER_ID});
//       //reset global variable
//       USER_ID = '';

//   }

//   function pushClientId(){
//     //push CLIENT id to session collection for SESSION CONNECTION


//       let docRef = db.collection(SESSION_ID);

//       let id = docRef.doc(USER_ID).set({id: USER_ID});
//       //reset global variable
//       USER_ID = '';


//   }

//   router.get('/getSessionId', (_, res) => {
//     pushHostId();
//     console.log("\n http://localhost:3000/false/" + SessionId + "\n");
//     res.redirect(`/#/config-setlist/${SessionId}`);
//   });



//   router.get('/setConfigParams', (req, res) => {
//     //add more params to config screen to inject into engine
//       let locSetlistName = '';
//       let locSessionName = '';
//       selectedGenre = req.query.genre.toLowerCase();

//       console.log(selectedGenre);

//       if(req.query.setlistName === '' || undefined || null){
//         locSetlistName = 'My Setlist';
//         setlistName = locSetlistName;
//         locSetlistName = '';
//       }else {
//         locSetlistName = req.query.setlistName;
//         setlistName = locSetlistName;
//         locSetlistName = '';
//       }

//       if(req.query.sessionName === '' || undefined || null){
//         locSessionName = 'My Session';
//         sessionName = locSessionName;
//         locSessionName = '';
//       }else {
//         locSessionName = req.query.sessionName;
//         sessionName = locSessionName;
//         locSessionName = '';
//       }


//       gblAccessToken = '';
//       gblRefreshToken = '';
//     res.redirect(`/run-engine`);

//   });






// router.get('/run-engine', (_, res) => {

//   console.log("--------------------------------- \nRunning Engine\n---------------------------------");

//   spotifyApi.setAccessToken(gblHostAccessToken);
//   spotifyApi.setRefreshToken(gblHostRefreshToken);

//   accessDb();

// //Setlist Engine V0.0.2.2 =====>

// function accessDb() {

//   console.time("Engine Run Time");

//   let userIds = [];

//   //first get all docs and and set count variable
//     let sessionRef = db.collection(SessionId);
//     SessionId = '';


//   let getUsers = sessionRef.get()
//   .then(snapshot => {
//     snapshot.forEach(doc => {
//        userIds.push(doc.id);
//     });
//     sendSessionIds(userIds);
//   })

// }



//   //loop through user ids present in the session and pull their profile -
//   //then populate data array

//   async function sendSessionIds(userIds){


//       let docRef = db.collection("users");
//       let userData = [];


//     console.log("Session Members: " + userIds + " /// No. of Session Members: " + userIds.length);


//       for (let i = 0; i < userIds.length; i++){
//           let query = await docRef.where('id', '==', userIds[i]).get()
//           .then(snapshot => {
//           if (snapshot.empty) {
//             console.log('Error getting documents (019)', err);
//             res.redirect('/#/error/Oops something went wrong! Error Code: (019)');
//             return;
//           } else {
//             snapshot.forEach(doc => {
//             userData.push(doc.data());
//             })
//            }
//          });
//        }
//       sendData(userData);
//  }



//  async function sendData(data){

//    /**
//      * Check if user has data in the TopTracks_ShortTerm object,
//      * If not - then check to see if user has data in the TopTracks_MediumTerm object
//      * If not - then check to see if user has data in the TopTracks_LongTerm object
//      * If not - then check to see if user has data in the RecentlyPLayedTracks object
//      * If not - then don't use user's data and delete them
//      */


// //Input data validation

//   for(let i = 0; i < data.length; i++){

//     if(data[i].TopTracks_ShortTerm.itemsS === undefined || data[i].TopTracks_ShortTerm.itemsS.length == 0 ||  data[i].TopTracks_ShortTerm.itemsS === []){
//       console.log("User " + i + " has no data in TopTracks_ShortTerm");

//       if(data[i].TopTracks_MediumTerm.itemsM == undefined || data[i].TopTracks_MediumTerm.itemsM.length == 0 ||  data[i].TopTracks_MediumTerm.itemsM == []){
//         console.log("User " + i + " has no data in TopTracks_MediumTerm");

//         if(data[i].TopTracks_LongTerm.itemsL == undefined || data[i].TopTracks_LongTerm.itemsL.length == 0 ||  data[i].TopTracks_LongTerm.itemsL == []){
//           console.log("User " + i + " has no data in TopTracks_LongTerm");

//           if(data[i].RecentlyPlayedTracks.items == undefined || data[i].RecentlyPlayedTracks.items == 0 ||  data[i].RecentlyPlayedTracks.items == []){
//             console.log("User " + i + " has no data in RecentlyPlayedTracks, ignore them.");
//             delete data[i]
//           }else if(data[i].RecentlyPlayedTracks.items !== undefined || data[i].RecentlyPlayedTracks.items != 0 ||  data[i].RecentlyPlayedTracks.items !== []){
//              users.push(data[i].RecentlyPlayedTracks);
//              console.log("User " + i + " has data in RecentlyPlayedTracks");
//           }else{
//             console.log("Input Data Error");
//           }
//         }else if(data[i].TopTracks_LongTerm.itemsL !== undefined || data[i].TopTracks_LongTerm.itemsL.length != 0 ||  data[i].TopTracks_LongTerm.itemsL !== []){
//            users.push(data[i].TopTracks_LongTerm);
//            console.log("User " + i + " has data in TopTracks_LongTerm");
//         }else{
//           console.log("Input Data Error");
//         }
//       }else if(data[i].TopTracks_MediumTerm.itemsM !== undefined || data[i].TopTracks_MediumTerm.itemsM.length != 0 ||  data[i].TopTracks_MediumTerm.itemsM !== []){
//          users.push(data[i].TopTracks_MediumTerm);
//          console.log("User " + i + " has data in TopTracks_MediumTerm");
//       }else{
//         console.log("Input Data Error");
//       }
//     }else if(data[i].TopTracks_ShortTerm.itemsS !== undefined || data[i].TopTracks_ShortTerm.itemsS.length != 0 ||  data[i].TopTracks_ShortTerm.itemsS !== []){
//        users.push(data[i].TopTracks_ShortTerm);
//        console.log("User " + i + " has data in TopTracks_ShortTerm");
//     }else{
//       console.log("Input Data Error");
//     }
//   }

//     await generateSetlist(users);
//     //clearing the users array for other sessions
//     users = [];

// }



// function generateSetlist(users) {


//     console.log("----------------------------GENERATE SETLIST---------------------------");
//       // iterating through the users array
//       for (var i = 0, len = users.length; i < len; i++){
//         // iterating through the tracks for each user
//         for (var j = 0, len2 = Object.keys(users[0].itemsS).length; j < len2; j++){
//           // check if the current track's genres contains the string for the genre entered by the user
//           if(users[i].itemsS[j].artist.genres.indexOf(selectedGenre) > -1){
//             // Checking here first if this track has already been added to the setlist (eliminating duplicates)
//             if(!(users[i].itemsS[j].id in trackDict)){
//               // if not, add the track name to the track dictionary with a score of 0
//               count++;
//               trackDict[users[i].itemsS[j].id] = 0;
//             }
//             // else, a duplicate has been detected, meaning more than one user listens to this song
//             else {
//               // increment the score for this song
//               var score  = trackDict[users[i].itemsS[j].id];
//               score++;
//               trackDict[users[i].itemsS[j].id] = score;
//             }
//           }
//           // else check if the current track's genres contain substrings of the genre entered by the user
//           else if(users[i].itemsS[j].artist.genres.find(a =>a.includes(selectedGenre  + new Array(0).join(' ')))){
//             // Checking here first if this track has already been added to the setlist (eliminating duplicates)
//             if(!(users[i].itemsS[j].id in trackDict)){
//               // if not, add the track name to the tack dictionary with a score of 0
//               count++;
//               trackDict[users[i].itemsS[j].id] = 0;
//             }
//             // else, a duplicate has been detected, meaning more than one user listens to this song
//             else {
//               // increment the score for this song
//               var score  = trackDict[users[i].itemsS[j].name];
//               score++;
//               trackDict[users[i].itemsS[j].id] = score;
//             }
//           }
//         }
//       }


//     //reset global variable
//     selectedGenre = '';

//       // create an array based on the keys and values of the trackDict dictionary
//       var sortedTracks = Object.keys(trackDict).map(function(key) {
//         return [key, trackDict[key]];
//       });

//       // shuffling the array initially to diversify the pool of tracks that have a score of 0
//       shuffle(sortedTracks);

//       // Sort the array based on the second element, which was previously the score value in the dictionary pair, to allow the most common tracks among the users to play first
//       sortedTracks.sort(function(el1, el2) {
//         return el2[1] - el1[1];
//       });


//       // logging the sorted array
//       //console.log(sortedTracks);

//       // iterate through the sortedtracks array and push the track names to the finalSet array
//       for(var t = 0, len = sortedTracks.length; t < len; t++){
//         finalSet.push(pfx + sortedTracks[t][0]);
//       }

//       console.log(trackDict);


//     createSetlist();


// }
// function createSetlist(){

//   spotifyApi.setAccessToken(gblHostAccessToken);
//   spotifyApi.setRefreshToken(gblHostRefreshToken);


//       spotifyApi.createPlaylist(gblHost_Id, setlistName, { 'public' : true })
//       .then(function(data) {
//         console.log('Setlist Seeded');
//         getSetlistId();
//       }, function(err) {
//         console.log('Something went wrong!', err);
//       });

//     setlistName = '';



// }

// async function getSetlistId() {


//       let seeding = spotifyApi.getUserPlaylists(gblHost_Id , {limit: 1 , offset: 0}).then(({ body }) =>{
//         console.log("CATCH 1");
        
//         locPlaylistId = body.items[0].id;
//         gblPlaylistId = locPlaylistId;
//         locPlaylistId = '';
//         // addTracksToSetlist();
//       });
//       await Promise.all([seeding]);
//       console.log("CATCH 2");

//       addTracksToSetlist();

//   }
// async function addTracksToSetlist() {
//   console.log("CATCH 3");

//   await spotifyApi.setAccessToken(gblHostAccessToken);
//   await spotifyApi.setRefreshToken(gblHostRefreshToken);

//   console.log("CATCH 4");
//   console.log("---------------HOST ID---", gblHost_Id);
//   console.log("---------------Playlist ID---", gblPlaylistId);
//   console.log("---------------FINAL SET---", finalSet);

  


//     await spotifyApi.addTracksToPlaylist(gblHost_Id, gblPlaylistId, finalSet).then(({ body }) =>{
//       console.log("CATCH 5");
//     }).catch(err =>{
//        `ERROR =>  ${err}`;
//        res.redirect('/#/error/Oops something went wrong! Error Code: (019)');
//       });
    

//     console.log('Setlist Created!');
//     res.redirect(`/#/play-setlist/${gblHost_Id}/${gblPlaylistId}`);
//     console.timeEnd("Engine Run Time");
//     gblHost_Id = '';
//     gblPlaylistId = '';
//     gblSetlist = [];
//     finalSet = [];
//     gblHostAccessToken = '';
//     gblHostRefreshToken = '';

// }


// /*
// * function to shuffle an array to diversify the setlist order for tracks that have a score of 0
// */
// function shuffle(array) {


//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;


//   }

// });




// module.exports = router;

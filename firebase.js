// import firebase from 'firebase'
// import firebase from 'firebase/app';
// import 'firebase/storage';
// import "firebase/database";
// import "firebase/auth";

// import * as firebase from "firebase/app";
import firebase from 'firebase'

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

  // Your web app's Firebase configuration
  var config = {
    apiKey: "AIzaSyBKNUqWQIm2CBQjg2xMDiA7o7lst0t-BNg",
    authDomain: "setlistapp-59007.firebaseapp.com",
    databaseURL: "https://setlistapp-59007.firebaseio.com",
    projectId: "setlistapp-59007",
    storageBucket: "setlistapp-59007.appspot.com",
    messagingSenderId: "104152628622",
    appId: "1:104152628622:web:6b91145e03c9eacc0bb8df",
    measurementId: "G-W9YEZP7MCK"
  };

  firebase.initializeApp(config)

  export const fire = firebase
  export const firebaseAuth = firebase.auth
  // export const db = firebase.firestore();

  // class Firebase {
  //   constructor() {
  //     firebase.initializeApp(config);

  //     this.auth = firebase.auth();
  //   }

  //   // *** Auth API ***

  //   doCreateUserWithEmailAndPassword(email, password){
  //     this.auth.createUserWithEmailAndPassword(email, password);
  //   }

  //   doSignInWithEmailAndPassword(email, password){
  //     this.auth.signInWithEmailAndPassword(email, password);
  //   }
  //   doSignOut(){
  //     this.auth.signOut();
  //   }
  //   // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  //   // doPasswordUpdate = password =>
  //   //   this.auth.currentUser.updatePassword(password);
  // }
// export const provider = new firebase.auth.GoogleAuthProvider();
// export const auth = firebase.auth();
// firebase.initializeApp(config);
export default firebase;

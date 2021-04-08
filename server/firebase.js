const admin = require('firebase-admin');
let serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
let docRef = db.collection('users');

console.log("");


  let getUsers = docRef.get()
  .then(snapshot => {
    console.log("Registered Users" + snapshot.size);

  })
console.log("");

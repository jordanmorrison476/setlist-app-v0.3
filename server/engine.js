const admin = require('firebase-admin');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

// initializing global variables
var selectedGenre;
var trackDict = {};
var count = 0;
let users = [];
let finalSet = [];

/*
* readInput just allows for testing the input of different strings for the selected genres from the commandline
*/
async function readInput(req, res){
    await readline.question(`What genre do you want to listen to?`, inpt => {
    console.log(`Chosen ${inpt}!`)
    selectedGenre = inpt;
    getData();
    readline.close();
  })
}
let serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// initializing the database
let db = admin.firestore();
let dataRef = db.collection('users');

/*
* The data is pulled from the Firestore here but on some occasions (usually when first starting up the server)
* the data either does not come through or the 'users' array is not populated in time and it throws an error
* Need to fix this before production version
*/

async function getData(req,res){
  // await the return of the query from the firestore
  let query = await dataRef.get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      console.log(`Received query snapshot of size ${snapshot.size}`);
      snapshot.forEach(doc => {
        // add the users' data to the users array
        users.push(doc.data().TopTracks_ShortTerm);



      });
      // once the users array is populated, run the algorithm to create the setlist
      runEngine();

    })
    .catch(err => {
      console.log('Error getting documents', err);
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


/*
* So far the tracks that match the chosen genre string are put into the 'matchedGenres' array successfully.
* Need to add a check to make sure a trck is not added to the array from one user's dataset if it has already been added from another user's already
* Need to also make it so the popularity of the track is also taken into account and that could help add other popular tracks if there are few that match the chosen genre
*/

// this function is the main algorithm for sorting the music for setlist
async function runEngine(req, res){
  // if the users array has not been populated, there is a problem, run the getData function again
  if(users.length == 0){
    getData();
  }

  console.log(users);
  // iterating through the users array
  for (var i = 0, len = users.length; i < len; i++){
    // iterating through the tracks for each user
    for (var j = 0, len2 = Object.keys(users[0].itemsS).length; j < len2; j++){
      // check if the current track's genres contains the string for the genre entered by the user
      if(users[i].itemsS[j].artist.genres.indexOf(selectedGenre) > -1){
        // Checking here first if this track has already been added to the setlist (eliminating duplicates)
        if(!(users[i].itemsS[j].name in trackDict)){
          // if not, add the track name to the track dictionary with a score of 0
          count++;
          trackDict[users[i].itemsS[j].name] = 0;
        }
        // else, a duplicate has been detected, meaning more than one user listens to this song
        else {
          // increment the score for this song
          var score  = trackDict[users[i].itemsS[j].name];
          score++;
          trackDict[users[i].itemsS[j].name] = score;
        }
      }
      // else check if the current track's genres contain substrings of the genre entered by the user
      else if(users[i].itemsS[j].artist.genres.find(a =>a.includes(selectedGenre  + new Array(0).join(' ')))){
        // Checking here first if this track has already been added to the setlist (eliminating duplicates)
        if(!(users[i].itemsS[j].name in trackDict)){
          // if not, add the track name to the tack dictionary with a score of 0
          count++;
          trackDict[users[i].itemsS[j].name] = 0;
        }
        // else, a duplicate has been detected, meaning more than one user listens to this song
        else {
          // increment the score for this song
          var score  = trackDict[users[i].itemsS[j].name];
          score++;
          trackDict[users[i].itemsS[j].name] = score;
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
  console.log(sortedTracks);

  // iterate through the sortedtracks array and push the track names to the finalSet array
  for(var t = 0, len = sortedTracks.length; t < len; t++){
    finalSet.push(sortedTracks[t][0]);
  }

  // logging the finalSet array
  console.log(finalSet);
}

// calling the function to allow the user to input the genre they wish to filter by
readInput();

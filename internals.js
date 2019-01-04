var prompt = require('prompt');

// mongodb init
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongodbUrl = 'mongodb://localhost:27017';

prompt.start();

module.exports.home = (docs) => {
  console.log("Welcome, " + docs[0].username + ".");
  console.log("Please select your next option: 'review' 'rate' 'hover' 'exit'");
  prompt.get(["entering"], (err, result) => {

    //exit
    if (result.entering === 'exit') {
      process.exit();
    }

    // review
    else if (result.entering === 'review') {
      // review(docs);
      console.log("This feature is under dev");
      module.exports.home(docs);
    }

    else if (result.entering === 'rate') {
      console.log("This feature is under dev");
      module.exports.home(docs);
    }
    else if (result.entering === 'hover') {
      console.log("This feature is under dev");
      module.exports.home(docs);
    }
    else {
      console.log("invalid input, please try again");
      module.exports.home(docs);
    };
  })
};

// review CLI
function review (docs) {
  console.log("Please select a hotel to review from the below list:");
  console.log("1. Rockk Onn");
  console.log("2. Food of Heaven");
  console.log("3. Aroma");
  console.log("4. Feel It");
  console.log("5. KhanaBot Nights");
  console.log("Please enter the option number of the hotel you want to review. Or 'back' to go to the previous menu.");
  prompt.get(["reviewOption"], (err, result) => {
    if (result.reviewOption === 'back') {
      module.exports.home(docs);
    }
    else if (result.reviewOption === '1') {

    }
  })
};

// review I/O
function reviewIO() {
  console.log("please enter your review below and press enter to submit");
  prompt.get(["review"], (err, result) => {
    if (result.review == "") {
      console.log("Please write an actual review.");
      reviewIO(/* add same options as before*/);
    }
    else {
      // mongo submission
    }
  })
};
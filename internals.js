var prompt = require('prompt');

// mongodb init
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongodbUrl = 'mongodb://localhost:27017';
var dbName = 'test';

prompt.start();

module.exports.home = (docs) => {
  console.log("Welcome, " + docs[0].username + ".");
  console.log("Please select your next option: 'review' 'rate' 'hover' 'exit'");
  prompt.get(["entering"], (err, result) => {

    if (result.entering === 'exit') {
      process.exit();
    }

    else if (result.entering === 'review') {
      review(docs);
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
  });
};

// review CLI
function review (docs) {
  console.log("Please select a restaurant to review from the below list:");
  console.log("1. Rockk Onn");
  console.log("2. Food of Heaven");
  console.log("3. Aroma");
  console.log("4. Feel It");
  console.log("5. KhanaBot Nights");
  console.log("Please enter the option number of the restaurant you want to review. Or 'back' to go to the previous menu.");
  prompt.get(["reviewOption"], (err, result) => {
    if (result.reviewOption === 'back') {
      module.exports.home(docs);
    }
    else if (parseInt(result.reviewOption) >= 1 && parseInt(result.reviewOption) <= 5) {
      reviewIO(docs, parseInt(result.reviewOption));
    }
    else {
      console.log("Invalid input, please try again");
      review(docs);
    }
  })
};

// review I/O
function reviewIO(docs, optionNumber) {
  var option = "test";
  if(optionNumber === 1) {
    option = 'rockkonn';
  }
  else if (optionNumber === 2) {
    option = 'foodofheaven';
  }
  else if (optionNumber === 3) {
    option = 'aroma';
  }
  else if (optionNumber === 4) {
    option = 'feelit';
  }
  else if (optionNumber === 5) {
    option = 'khanabotnights'
  }
  else {
    console.log ("optionNumber out of range, please debug");
    process.exit();
  }

  console.log(docs[0].username + ", please enter your review below and press enter to submit");
  prompt.get(["review"], (err, result) => {
    if (result.review == "") {
      console.log("Please write an actual review.");
      reviewIO(docs, optionNumber);
    }
    else {
      // mongodb submission
      MongoClient.connect(mongodbUrl, (err, client) => {
        assert.equal(null, err);
        const db = client.db(dbName);

        // submission function
        const submitReview = (db, callback) => {
          const collection = db.collection(option);
          collection.insertMany([{
            username: docs[0].username,
            creationTime: new Date(),
            review: result.review
          }], (err, submitresult) => {
            console.log("Successfully submitted review.");
            callback(submitresult);
          });
        };

        submitReview(db, (reviewDocument) => {
          console.log("here is the object of the review:");
          console.log(reviewDocument);
          module.exports.home(docs);
          client.close();
        });
      });
    };
  });
};

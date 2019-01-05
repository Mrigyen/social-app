'use strict';

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
      rate(docs);
    }

    else if (result.entering === 'hover') {
      hover(docs);
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
    else if (parseInt(result.reviewOption) >= 1 && parseInt(result.reviewOption) <= 5 && (result.reviewOption % 1 === 0)) {
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

// hover CLI
function hover (docs) {
  console.log("Please select a restaurant to hover from the below list:");
  console.log("1. Rockk Onn");
  console.log("2. Food of Heaven");
  console.log("3. Aroma");
  console.log("4. Feel It");
  console.log("5. KhanaBot Nights");
  console.log("Please enter the option number of the restaurant you want to hover. Or 'back' to go to the previous menu.");
  prompt.get(["hoverOption"], (err, result) => {
    if (result.hoverOption === 'back') {
      module.exports.home(docs);
    }
    else if (parseInt(result.hoverOption) >= 1 && parseInt(result.hoverOption) <= 5 && (result.hoverOption % 1 === 0)) {
      hoverIO(docs, parseInt(result.hoverOption));
    }
    else {
      console.log("Invalid input, please try again");
      hover(docs);
    }
  })
};

// hover IO
function hoverIO(docs, optionNumber) {
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

  //mongodb query
  MongoClient.connect(mongodbUrl, (err, client) => {
    assert.equal(null, err);
    const db = client.db(dbName);

    const findDocuments = (db, callback) => {
      const collection = db.collection(option);
      collection.find().toArray((err, reviewdocs) => {
        assert.equal(err, null);
        callback(reviewdocs);
      });
    };
    findDocuments(db, (reviewdocs) => {
      //sort array of review docs by time stamp, descending order
      reviewdocs.sort((a, b) => {
        return Date.parse(b.creationTime) - Date.parse(a.creationTime);
      });

      // print latest 10 reviews
      console.log("Here are the latest 10 reviews of " + option);
      for (var i = 0; i < reviewdocs.length && i < 10; i++) {
        console.log("Username: " + reviewdocs[i].username);
        console.log("Reviewed on: " + reviewdocs[i].creationTime.toUTCString());
        console.log("Review: \n" + reviewdocs[i].review + "\n\n");
      };

      module.exports.home(docs);
    });
  });
};

// rate CLI
function rate (docs) {
  console.log("Please select a restaurant to rate from the below list:");
  console.log("1. Rockk Onn");
  console.log("2. Food of Heaven");
  console.log("3. Aroma");
  console.log("4. Feel It");
  console.log("5. KhanaBot Nights");
  console.log("Please enter the option number of the restaurant you want to rate. Or 'back' to go to the previous menu.");
  prompt.get(["rateOption"], (err, result) => {
    if (result.rateOption === 'back') {
      module.exports.home(docs);
    }
    else if (parseInt(result.rateOption) >= 1 && parseInt(result.rateOption) <= 5 && (result.rateOption % 1 === 0)) {
      rateIO(docs, parseInt(result.rateOption));
    }
    else {
      console.log("Invalid input, please try again");
      rate(docs);
    }
  })
};

// rate I/O
function rateIO(docs, optionNumber) {
  var option = "test";
  if(optionNumber === 1) {
    option = 'raterockkonn';
  }
  else if (optionNumber === 2) {
    option = 'ratefoodofheaven';
  }
  else if (optionNumber === 3) {
    option = 'ratearoma';
  }
  else if (optionNumber === 4) {
    option = 'ratefeelit';
  }
  else if (optionNumber === 5) {
    option = 'ratekhanabotnights'
  }
  else {
    console.log ("optionNumber out of range, please debug");
    process.exit();
  }

  console.log(docs[0].username + ", please enter your rating below and press enter to submit. It should be an integer, ranging from 1 to 5, inclusive.");
  prompt.get(["rating"], (err, result) => {
    if (parseInt(result.rating) >= 1 && parseInt(result.rating) <= 5 && (parseFloat(result.rating) % 1 == 0)) {
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
            rating: result.rating
          }], (err, submitresult) => {
            console.log("Successfully submitted rating.");
            callback(submitresult);
          });
        };

        submitReview(db, (ratingDocument) => {
          console.log("here is the object of the rating:");
          console.log(ratingDocument);
          module.exports.home(docs);
          client.close();
        });
      });
    }

    else {
      console.log("Please write an actual rating.");
      rateIO(docs, optionNumber);
    };
  });
};

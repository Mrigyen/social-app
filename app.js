'use strict';

// a simple terminal based login system using nodejs and mongodb

var prompt = require('prompt');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var internals = require('./internals');

var mongodbUrl = 'mongodb://localhost:27017';
var dbName = 'test';

// error handling
function onErr(err) {
  console.log(err);
  return 1;
}

// driver function for login
const findUser = (db, usernamestring, passwordstring, callback) => {
  // get the document collection
  const collection = db.collection('user-details');

  // find the document
  collection.find({username: usernamestring, password: passwordstring}).toArray((err,docs) => {
    if (err !=  null) console.log("Error in getting data from mongoDB");
    assert.equal(err, null);
    callback(docs);
  });
};

// driver function for verifying whether new user is unique
const verifyNewUser = (db, usernamestring, callback) => {
  // get the document collection
  const collection = db.collection('user-details');

  // find the document
  collection.find({username: usernamestring}).toArray((err,docs) => {
    if (err !=  null) console.log("Error in getting data from mongoDB");
    assert.equal(err, null);
    callback(docs);
  });
};

// driver function for register
const addUser = (db, usernamestring, passwordstring, callback) => {
  const collection = db.collection('user-details');

  collection.insertMany([{username: usernamestring, password: passwordstring}], (err, result) => {
    assert.equal(err, null);
    console.log("Registered " + usernamestring);
    callback(result);
  });
};

// welcome message and choose

prompt.start();

function welcome() {
  console.log("Please enter choice: 'login' 'register' 'exit'");
  prompt.get(['entering'], (err, result) => {

    if (result.entering === 'login') {
      prompt.get(['username', 'password'], (err, result) => {
        // check for existence of username password in mongo database, return data
        MongoClient.connect(mongodbUrl, (err, client) => {
          if (err) return onErr(err);
          assert.equal(null, err);
          console.log("Connected successfully to mongoDB server");
          var db = client.db(dbName);

          findUser(db, result.username, result.password, (docs) => {
            if (docs.length === 0) {
              console.log("Did not find username password combination, please try again.");
              console.log(docs);
              welcome();
            }
            else {
              console.log("Found username password combination.");
              console.log(docs);
              internals.home(docs);
            }
            client.close();
          });
        });
      });
    }

    else if (result.entering === 'register') {
      prompt.get(['username', 'password'], (err, result) => {
        MongoClient.connect(mongodbUrl, (err, client) => {
          if (err) return onErr(err);
          assert.equal(null, err);
          console.log("Connected successfully to mongoDB server");
          var db = client.db(dbName); // creating global variable db

          // Check if username doesn't exist, if so then register, else retry
          verifyNewUser(db, result.username, (docs) => {
            if (docs.length === 0) {
              addUser(db, result.username, result.password, (docs) => {
                console.log(docs);
                client.close();
              });
            }
            else {
              console.log("Username already exists. Please try again.");
              console.log(docs);
              welcome();
            };
          });
        });
      });
    }

    else if (result.entering === 'exit') {
      console.log("You chose to exit");
      process.exit();
    }

    else welcome();
  });
};

welcome();


/*
TODO:
new options: review hover rating
hover: descending timestamp
*/


/*
 * The purpose of this file is to define a ste of functions that will act as an interface between the application and mongodb.
 * The mongodb server is configured in db/config.js
*/

var User = require('./config').User;
var MatchRequest = require('./config').MatchRequest;
var SuccessfulMatch = require('./config').SuccessfulMatch;
var Promise = require('bluebird');

exports.db = {
  getUsers: function(username, email) {
    // Creates object to query database
    var dbQueryObject = {};
    if (username) {
      dbQueryObject.username = username;
    }
    if (email) {
      dbQueryObject.email = email;
    }

    return new Promise(function(resolve, reject) {
      User.find(dbQueryObject, function(error, users) {
        if (error) {
          console.log('ERROR calling getUsers function', error);
          reject(error);
        } else {
          resolve(users);
        }
      });
    });
  },

  addUser: function(username, email, funFact, profileImage) {
    var newDbEntry = {
      username: username,
      email: email,
      funFact: funFact,
      profileImage: profileImage
    };

    var  newUser = new User(newDbEntry);

    return new Promise(function(resolve, reject) {
      newUser.save(function(error, newUser) {
        if (error) {
          console.log('ERROR calling addUser function', error);
          reject(error);
        } else {
          resolve(newUser);
        }
      });
    });
  },

  getAllUsers: function() {
    return new Promise(function(resolve, reject) {
      User.find({}, function(error, users) {
        if (error) {
          console.log('ERROR calling getAll function', error);
          reject(error);
        } else {
          resolve(users);
        }
      });
    });
  },

  removeUser: function(username, email) {
    var dbQueryObject = {};
    if (username) {
      dbQueryObject.username = username;
    }
    if (email) {
      dbQueryObject.email = email;
    }

    return new Promise(function(resolve, reject) {
      User.remove(dbQueryObject, function(error) {
        if(error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
};
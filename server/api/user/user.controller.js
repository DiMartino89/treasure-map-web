'use strict';

var User = require('./user.model');
var Location = require('../location/location.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var request = require('request');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 */
exports.index = function(req, res) {
  if (req.user.role === 'admin') {
    User.find({}, '-salt -hashedPassword', function (err, users) {
      if (err) return res.send(500, err);
      res.json(200, users);
    });
  } else {
    User.find({}, '_id name role friends requests', function (err, users) {
      if (err) return res.send(500, err);
      res.json(200, users);
    });
  }
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.description = '';
  newUser.status = 'Hello, I am new on Treasure Map!';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
    if (process.env.DOMAIN && process.env.DOMAIN.indexOf("localhost") == -1 && process.env.DOMAIN.indexOf("127.0.0.1") == -1) sendUserToSlack(user, 'created');
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId)
    .populate('friends', '_id name role friends picture description status')
	.populate('requests', '_id name role friends picture description status')
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return res.send(401);
      res.json(user.profile);
    });
};

/**
 * Get a single users locations
 */
exports.locations = function (req, res, next) {
  var userId = req.params.id;

  Location.find({ owner: userId })
    .populate('details.category')
    .populate('owner', '_id name role friends picture description status')
    .exec(function (err, locations) {
      if(err) { return next(err); }
      if (!locations) return res.send(404);
      return res.json(200, locations);
      //res.json(locations);
    })
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    if (process.env.DOMAIN && process.env.DOMAIN.indexOf("localhost") == -1 && process.env.DOMAIN.indexOf("127.0.0.1") == -1) sendUserToSlack(user, 'deleted');
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Add a new friend
 */
exports.addFriend = function(req, res, next) {
  var userId = req.user._id;
  var friendId = String(req.body.friendId);

  User.findById(userId, function (err, user) {
    if (user.friends.indexOf(friendId) === -1) {
      user.friends.push(friendId);
	  user.requests.splice(user.requests.indexOf(friendId), 1);
    } else {
      console.error('User already has this friend4');
      return res.send(500, 'User already has this friend4');
    }
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Adds you as Friend to the other person
 */
exports.addFriend2 = function(req, res, next) {
  var userId = req.user._id;
  var friendId = String(req.body.friendId);
  
  User.findById(friendId, function (err, user) {
		if (user.friends.indexOf(userId) === -1) {
		  user.friends.push(userId);
		} else {
		  console.error('User already has this friend4');
		  return res.send(500, 'User already has this friend4');
		}
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Remove a friend
 */
exports.removeFriend = function(req, res, next) {
  var userId = req.user._id;
  var friendId = String(req.body.friendId);

  User.findById(userId, function (err, user) {
    user.friends.splice(user.friends.indexOf(friendId), 1);
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Removes you as a friend from the other person
 */
exports.removeFriend2 = function(req, res, next) {
  var userId = req.user._id;
  var friendId = String(req.body.friendId);

  User.findById(friendId, function (err, user) {
    user.friends.splice(user.friends.indexOf(userId), 1);
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Send a new Friendrequest
 */
exports.sendRequest = function(req, res, next) {
  var userId = req.user._id;
  var friendId = String(req.body.friendId);

  User.findById(friendId, function (err, user) {
    if (user.requests.indexOf(userId) === -1) {
      user.requests.push(userId);
    } else {
      console.error('User already has this request');
      return res.send(500, 'User already has this request');
    }
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Remove a Friendrequest
 */
exports.removeRequest = function(req, res, next) {
  var userId = req.user._id;
  var friendId = String(req.body.friendId);

  User.findById(userId, function (err, user) {
    user.requests.splice(user.requests.indexOf(friendId), 1);
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Save a new user description
 */
exports.saveDescription = function(req, res, next) {
  var userId = req.user._id;
  var newDescription = String(req.body.description);

  User.findById(userId, function (err, user) {
    user.description = newDescription;
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Save a new user status
 */
exports.saveStatus = function(req, res, next) {
  var userId = req.user._id;
  var newStatus = String(req.body.status);

  User.findById(userId, function (err, user) {
    user.status = newStatus;
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Save the current length of friends locations
 */
exports.saveFriendsLocations = function(req, res, next) {
  var userId = req.user._id;
  var locationsLength = String(req.body.length);

  User.findById(userId, function (err, user) {
	user.friendslocations = locationsLength;
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Change a users profile picture
 */
exports.changeProfilePicture = function(req, res, next) {
  var userId = req.user._id;
  var oldPicture = String(req.body.oldPicture);
  var newPicture = String(req.body.newPicture);

  User.findById(userId, function (err, user) {
      user.picture.splice(user.picture.indexOf(oldPicture), 1);
	  user.picture.push(newPicture);
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });   
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword')
    .populate('friends', '_id name role friends picture description status')
	.populate('requests', '_id name role friends picture description status')
    .exec(function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function sendUserToSlack(user, method) {
  request({
    method: 'POST',
    url: config.others.slackUrl,
    body: JSON.stringify({
      "text": "A new user has been " + method + "! <http://" + process.env.DOMAIN + "/users/" + user._id + "|Click here> for details!",
      "username": "New User Bot",
      "icon_emoji": ":bust_in_silhouette:"
    })
  }, function (error, response, body) {
    if (error) {
      return console.error('sending message to Slack failed:', error);
    }
    console.log('sending message to Slack successful!  Server responded with:', body);
  });
}

'use strict';

angular.module('treasuremapApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, Location, $cookieStore, $q) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.me();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.me();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.me();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Add Friend
       *
       * @param  {String}   friendId
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      addFriend: function(friendId, callback) {
        var cb = callback || angular.noop;

        return User.addFriend({ id: currentUser._id }, {
          friendId: friendId
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * Add Friend 2
       *
       * @param  {String}   friendId
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      addFriend2: function(friendId, callback) {
        var cb = callback || angular.noop;

        return User.addFriend2({ id: currentUser._id }, {
          friendId: friendId
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * Friend Request
       *
       * @param  {String}   friendId
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      sendRequest: function(friendId, callback) {
        var cb = callback || angular.noop;

        return User.sendRequest({ id: currentUser._id }, {
          friendId: friendId
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * Check if user has requests
       *
       * @param  {String}   friendId
       * @return {boolean}
       */
      isRequest: function(friend) { // gets called 4x?
        //console.log(_.pluck(currentUser.friends, '_id').indexOf(friendId));
        return _.pluck(friend.requests, '_id').indexOf(currentUser._id) != -1;
      },
	  
	  /**
       * Remove Request
       *
       * @param  {String}   friendId
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      removeRequest: function(friendId, callback) {
        var cb = callback || angular.noop;

        return User.removeRequest({ id: currentUser._id }, {
          friendId: friendId
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Check if user has friend
       *
       * @param  {String}   friendId
       * @return {boolean}
       */
      isFriend: function(friendId) { // gets called 4x?
        //console.log(_.pluck(currentUser.friends, '_id').indexOf(friendId));
        return _.pluck(currentUser.friends, '_id').indexOf(friendId) != -1;
      },

      /**
       * Remove Friend
       *
       * @param  {String}   friendId
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      removeFriend: function(friendId, callback) {
        var cb = callback || angular.noop;

        return User.removeFriend({ id: currentUser._id }, {
          friendId: friendId
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * Remove Friend 2
       *
       * @param  {String}   friendId
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      removeFriend2: function(friendId, callback) {
        var cb = callback || angular.noop;

        return User.removeFriend2({ id: currentUser._id }, {
          friendId: friendId
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * save the user's description
       *
       * @param  {String}   description
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
	  saveDescription: function(description, callback) {
        var cb = callback || angular.noop;

        return User.saveDescription({ id: currentUser._id }, {
		  description: description
		}, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * save the user's status
       *
       * @param  {String}   status
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
	  saveStatus: function(status, callback) {
        var cb = callback || angular.noop;

        return User.saveStatus({ id: currentUser._id }, {
		  status: status
		}, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * save the current friends locations length
       *
       * @param  {String}   length
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
	  saveFriendsLocations: function(length, callback) {
        var cb = callback || angular.noop;

        return User.saveFriendsLocations({ id: currentUser._id }, {
		  length: length
		}, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
	  
	  /**
       * Change profile picture
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changeProfilePicture: function(oldPicture, newPicture, callback) {
        var cb = callback || angular.noop;

        return User.changeProfilePicture({ id: currentUser._id }, {
		  oldPicture: oldPicture,
		  newPicture: newPicture
		}, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });

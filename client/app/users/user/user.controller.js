'use strict';

angular.module('treasuremapApp')
.controller('UserCtrl', function ($scope, $stateParams, Auth, User, $location) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.isFriend = Auth.isFriend;
	$scope.isRequest = Auth.isRequest;
    $scope.user = User.get({ id: $stateParams.id });
    $scope.locations = User.locations({ id: $stateParams.id });
	
	//FRIENDS-PART ==============================================
	
	$scope.sendRequest = function (user) {
		Auth.sendRequest(user._id).then( function() {
			$scope.user.requests.push($scope.currentUser);
			console.log('Request sent');
		});
	};
	
	$scope.removeRequest = function (user) {
		Auth.removeRequest(user._id).then( function() {
			$scope.currentUser.requests.splice($scope.currentUser.requests.indexOf(user._id), 1);
			$window.location.reload();
			console.log('Request removed');
		});
    };
	
	$scope.addFriend = function (user) {
		Auth.addFriend(user._id).then( function() {
			$scope.currentUser.friends.push(user);
			$scope.currentUser.requests.splice($scope.currentUser.requests.indexOf(user._id), 1);
			console.log('Friend added to you');
		});
	};
	$scope.addFriend2 = function (user) {
		Auth.addFriend2(user._id).then( function() {
			user.friends.push($scope.currentUser);
		});
	};

    $scope.removeFriend = function (user) {
		Auth.removeFriend(user._id).then( function() {
			$scope.currentUser.friends.splice($scope.currentUser.friends.indexOf(user._id), 1);
			console.log('Friend removed');
		});
    };	
	$scope.removeFriend2 = function (user) {
		Auth.removeFriend2(user._id).then( function() {
			user.friends.splice(user.friends.indexOf($scope.currentUser._id), 1);
		});
    };	
	
	$scope.getLocationBackground = function (location) {
      if (location.details !== undefined) {
        if (location.details.pictures.length > 0) {
          return {
            'background-image': 'linear-gradient(transparent 25%, black), url(' + location.details.pictures[0] + ')',
            'height': 'auto'
          }
        } else {
          return {
            'background-image': 'linear-gradient(transparent 25%, black), url("/assets/images/locations/default-location-images/default-' + location.details.category.name + '.png")',
            'height': 'auto'
          }
        }
      }
    };
  });
'use strict';

angular.module('treasuremapApp')
  .controller('UsersCtrl', function ($scope, User, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.isFriend = Auth.isFriend;
	$scope.isRequest = Auth.isRequest;
    $scope.users = User.query();
    $scope.allUsers = false;
	
    console.log($scope.users);
	
	$scope.sendRequest = function (user) {
		Auth.sendRequest(user._id).then( function() {
			user.requests.push($scope.currentUser);
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
  });

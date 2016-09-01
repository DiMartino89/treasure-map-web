'use strict';

angular.module('treasuremapApp')
  .controller('FriendsCtrl', function ($scope, User, Auth) {
	$scope.isFriend = Auth.isFriend;
    $scope.user = Auth.getCurrentUser();
    $scope.locations = [];

    for(var i = 0; i < $scope.user.friends.length; i++) {
      $scope.user.friends[i].locations = User.locations({ id: $scope.user.friends[i]._id }, function (locations) {
        $scope.locations = $scope.locations.concat(locations);
      });
    }
  });

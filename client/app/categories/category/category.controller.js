'use strict';

angular.module('treasuremapApp')
  .controller('CategoryCtrl', function ($scope, $stateParams, $http, Lightbox) {
    $http.get('/api/categories/'+$stateParams.id).success(function(category) {
      $scope.category = category;

      $http.get('/api/categories/'+$stateParams.id+'/locations').success(function(locations) {
        $scope.locations = locations;
      });
    });
	
	$scope.openImage = function (index) {
      Lightbox.openModal($scope.category.pictures, index);
    };
  });

'use strict';

angular.module('treasuremapApp')
  .controller('NavbarCtrl', function ($scope, $location, $modal, Auth, search, Locator, $timeout, $state) {
    $scope.menu = [{
      'title': 'Map',
      'link': 'map',
      'icon':'glyphicon-globe'
    }, {
      'title': 'Feed',
      'link': 'friends',
      'icon':'glyphicon-bullhorn'
    }, {
      'title': 'Friends',
      'link': 'users',
      'icon':'glyphicon-user'
    }, {
      'title': 'Locations',
      'link': 'locations',
      'icon':'glyphicon-map-marker'
    }];

    $scope.currentState = $state.$current.name;
    if ($scope.currentState === 'map') {
      _.each($scope.menu, function (item) {
        if (item.link === 'map') return;
        item.link = 'map.' + item.link;
        //item.onclick = 'showSidebar = true';
      });
    }

    $scope.showSearch = $state.$current.name;
    $scope.search = search;
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.smallScreen = function() {
      if(screen.width <= 800) {
         return true;
      }else{
         return false;
      }
    };

    $scope.locate = function () {
       var find = Locator.locate();
         find.then( function(currPos) {
          $timeout(function() {
            $scope.$apply(function() {
              $scope.search.userLocation = {
                latitude: currPos.latitude,
                longitude: currPos.longitude
              };
              $scope.search.map = {
                center: {
                  latitude: currPos.latitude,
                  longitude: currPos.longitude
                },
                zoom: 14
              };
            });
         });
      });
      $scope.clearSearch();
      $scope.search.showSidebar = false;
   };

   $scope.clearSearch = function () {
      $scope.search.searchTerm = '';
   };

   $timeout(function() {
       var popups = document.querySelectorAll('*[popover]');
       var popup = popups[0];
       var popupElement = angular.element(popup);
       $(popupElement).popover('show');
   }, 2000);

    $scope.logout = function () {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function (route) {
      return route === $location.path();
    };

    $scope.search.showSidebar = false;
    $scope.copyright = new Date().getFullYear();
  })
  .value('search', {
     searchTerm: '',
     map: '',
     userLocation: '',
     showSidebar: false,
     filterByFriends: false,
     filterByMyLocations: false
  });

'use strict';

angular.module('treasuremapApp')
  .controller('NavbarCtrl', function ($scope, $location, $modal, Auth, search, Locator, $timeout, $state, $http, $filter) {
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

    $http.get('/api/categories')
      .success(function(categories){
         $scope.categories = categories;
      });

    $scope.isFilterCollapsed = true;
    $scope.filteredCategory = false;
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
              $scope.clearSearch();
              $scope.search.showSidebar = false;
              $scope.search.getNewLocations = true;
            });
         });
      });
   };
   
   $scope.currNewFriendsLocations = [];

    for(var i = 0; i < $scope.user.friends.length; i++) {
      $scope.user.friends[i].locations = User.locations({ id: $scope.user.friends[i]._id }, function (locations) {
        $scope.currNewFriendsLocations = $scope.locations.concat(locations);
      });
    }

   $scope.clearSearch = function () {
      $scope.search.searchTerm = '';
   };

   $scope.filterCategory = function(category) {
      if($scope.filteredCategory != category) {
         $scope.filteredCategory = category;
         $scope.search.filterByCategory = category;
      }else{
         $scope.filteredCategory = '';
         $scope.search.filterByCategory = '';
      }
  }

   /*$scope.filterCategory = function(category) {
      console.log(category);
      var objIndex = $scope.filteredCategory.indexOf(category);
      if(objIndex < 0) {
         $scope.filteredCategory.push(category);
         $scope.search.filterByCategory = $scope.filteredCategory;
      }else{
         $scope.filteredCategory.splice(objIndex, 1);
         $scope.search.filterByCategory = $scope.filteredCategory;
      }
   }*/

   $timeout(function() {
       var popups = document.querySelectorAll('*[popover]');
       var popup = popups[0];
       var popupElement = angular.element(popup);
       //$(popupElement).popover('show');
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
     filterByCategory: false,
     filterByFriends: false,
     filterByMyLocations: false,
     getNewLocations: false
  });

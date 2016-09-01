'use strict';

angular.module('treasuremapApp')
  .controller('NavbarCtrl', function ($scope, $http, $state, Auth, $modal, search, User, $timeout, $interval, $window, Locator, $location, Location) {

	$scope.currentPath = $location.path();
	
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
	
	$scope.locationsLink = [{
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

    $scope.isFilterCollapsed = false;
    $scope.filteredCategory = false;
    $scope.showSearch = $state.$current.name;
    $scope.search = search;
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
	$scope.currentUser = Auth.getCurrentUser();

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

	$scope.searchboxNav = {
      template: 'searchbox.tpl.html',
      events: {
        places_changed: function(searchBox) {
          $scope.place = searchBox.getPlaces()[0];

          var coordinates = {
            lat: $scope.place.geometry.location.lat(),
            latitude: $scope.place.geometry.location.lat(),
            lng: $scope.place.geometry.location.lng(),
            longitude: $scope.place.geometry.location.lng()
          };

          $scope.$apply(function() {
            $scope.search.userLocation = {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            };
            $scope.search.map = {
              center: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
              },
              zoom: 14
            };
          });
          $scope.getLocations($scope.search.userLocation, $scope.searchRadius);
          $scope.search.showSidebar = false;

        }
      }
    };
	
	$scope.newLocations = [];
	
	$scope.getAllFriendsLocations = function() {
		$scope.friendsLocations = [];

        for(var i = 0; i < $scope.currentUser.friends.length; i++) {
          $scope.currentUser.friends[i].locations = User.locations({ id: $scope.currentUser.friends[i]._id }, function (locations) {
			$scope.friendsLocations = $scope.friendsLocations.concat(locations);
			
			for(var j = 0; j < $scope.friendsLocations.length; j++) {
				if($scope.friendsLocations[j].details.publication == true || $scope.friendsLocations[j].details.members.indexOf($scope.currentUser._id) !== -1) {
					//do nothing
				} else {
					$scope.friendsLocations.splice(j, 1);
					j--;
				}
			}

            $scope.newLocations = $scope.friendsLocations;
          });
        }
	}
	
	$scope.saveFriendsLocations = function() {
		var length = $scope.newLocations.length;
		Auth.saveFriendsLocations( length ).then( function() {	
			$scope.currentUser.friendslocations = length;
		});
	}
   
   $scope.openModalNew = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'app/locations/new/new.html',
        controller: 'NewCtrl',
        size: size
      });

      modalInstance.result.then(function(newLocation) {
        newLocation.cluster = {
          styles: {
            url: 'assets/images/Cluster.png'
          }
        };
        $scope.search.map = { center: newLocation.coordinates, zoom: 15 };

        newLocation.icon = {
          url: newLocation.details.category.imgUrl
        };

        //location.click = selectLocation;

        $scope.locations.push(newLocation);
      }, function() {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
	
	$scope.openModalCalendar = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'components/calendar/calendar.html',
		controller: 'CalendarCtrl',
        size: size
      });
    };
	
	// Expiration for location dates
	$scope.currLocations = Location.query();
	
	$interval(function(){ $scope.expiration(); }, 100000);
	
	$scope.expiration = function() {
		var today = new Date();
		var minutesToday = today.getMinutes();
		var hoursToday = today.getHours();
		var dayToday = today.getDate();
		var monthToday = today.getMonth();
		var yearToday = today.getFullYear();
		var now = new Date(yearToday, monthToday, dayToday, hoursToday, minutesToday);
		for(var i=0; i < $scope.currLocations.length; i++) {
			if($scope.currLocations[i].owner.name != 'Admin') {
				var datetime = new Date($scope.currLocations[i].details.dateTime.toString());
				var minutes = datetime.getMinutes();
				var hours = datetime.getHours() - 2;
				var day = datetime.getDate();
				var month = datetime.getMonth();
				var year = datetime.getFullYear();
				var date = new Date(year, month, day, hours, minutes);
			}
			if(date < now) {
				$scope.delete($scope.currLocations[i]);
				//alert('Your Location ' + $scope.currLocations[i].details.name + ' was remove in case of date expired!');
			}
		}
	}
	
    $scope.delete = function(location) {
      Location.remove({ id: location._id });
      angular.forEach($scope.currLocations, function(l, i) {
        if (l === location) {
          $scope.currLocations.splice(i, 1);
        }
      });
    };

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
	
	$scope.select= function(item) {
	       $scope.selected = item; 
	};
	$scope.isActive = function(item) {
	       return $scope.selected === item;
	};

    /*$scope.isActive = function (route) {
      return route === $location.path();
    };*/

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
	 filterByAllRecommendedLocations: false,
     getNewLocations: false
  });

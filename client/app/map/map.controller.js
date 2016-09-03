'use strict';

angular.module('treasuremapApp')
  	.controller('MapCtrl', function ($rootScope, $scope, $http, $state, Auth, $modal, search, $filter, User, Lightbox, $timeout, Locator, $location, Location, $window) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.currentUser = Auth.getCurrentUser();
	$scope.isFriend = Auth.isFriend;
    $scope.search = search;

    $scope.openImage = function (index, images) {
      Lightbox.openModal(images, index);
    };

    $scope.$watch("search.searchTerm", function(searchTerm){
      $scope.filteredLocations = $filter("filter")($scope.locations, searchTerm);
      if (!$scope.filteredLocations){
        return;
      }
    });

    $scope.openModal = function(size) {

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

    var style = [{
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "simplified"
      }, {
        "color": "#666666"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [{
        "visibility": "on"
      }]
    }, {
      "elementType": "geometry",
      "stylers": [{
        "visibility": "simplified"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [{
        "visibility": "simplified"
      }]
    }, {
      "featureType": "landscape.natural",
      "stylers": [{
        "gamma": 2.5
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [{
        "lightness": 25
      }, {
        "gamma": 1.2
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{
        "color": "#FF931E"
      }, {
        "gamma": 1.5
      }]
    }, {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#f3f3f3"
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "poi",
      "elementType": "geometry.fill",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#e9e9e9"
      }]
    }, {
      "featureType": "transit",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#e3e3e3"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "simplified"
      }, {
        "gamma": 1.85
      }]
    }];

    var locate = Locator.locate();
    locate.then( function(currPos) {
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
         $scope.getLocations($scope.search.userLocation, $scope.searchRadius);
      });
   });

   var hideUI;
   if(screen.width <= 800) {
      hideUI = true;
   }else{
      hideUI = false;
   }

    $scope.search.map = {
      center: {
        latitude: 52.5075419,
        longitude: 13.4251364
      },
      zoom: 14
    };
    $scope.options = {
      styles: style,
      disableDefaultUI: hideUI
    };
    $scope.searchRadius = 25;
    $scope.search.userLocation = $scope.search.map.center;

    $scope.locations = [];

    $scope.$watch('search.getNewLocations', function() {
      $scope.getLocations($scope.search.userLocation, $scope.searchRadius);
      $scope.search.getNewLocations = false;
   });

    $scope.getLocations = function(coords, distance) {
      $http.get('/api/locations', {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          distance: distance
        }
      }).success(function(locations) {
        $scope.labels = '';
        $scope.locations = locations;

        $scope.filteredLocations = $scope.locations;

        _.each($scope.locations, function(location){

        //var link = location.details.name
        //  .toLowerCase()
        //  .replace(/[^\w\säöüß]/gi, '')
        //  .replace(/\s/g,'-')
        //  .replace(/--/g,'-')
        //  .replace(/ä/g,'ae')
        //  .replace(/ö/g,'oe')
        //  .replace(/ü/g,'ue')
        //  .replace(/ß/g,'ss');

        //location.link = location._id;
    	 //	location.title = location.details.name;
        //location.street = location.address.street;
        //location.zipcode = location.address.zipcode;
        //location.city = location.address.city;
        //location.category = location.details.category.name;
        //location.duration = location.details.duration;
        //location.id = location.details.category._id;

          $scope.clusterOpt = {
            styles: [{
              textColor: "white",
              height: 50,
              url: "assets/images/ClusterPin02.png",
              width: 50
            }],
          };

          location.icon = {
            url: location.details.category.imgUrl,
            // size: new google.maps.Size(50, 62),
            // origin: new google.maps.Point(0,0),
            // anchor: new google.maps.Point(0, 17)
          };

          //location.click = selectLocation;

        });
      });
    };

    var clicked = false;

    $scope.markersEvents = {
      mouseover: function (gMarker, eventName, model) {
        clicked = false;
        model.show = true;
        $scope.$apply();
      },
      mouseout: function (gMarker, eventName, model) {
        model.show = clicked === true;
        $scope.$apply();
      },
      click: function (gMarker, eventName, model) {
        if ($state.params.id === model._id) {
          $state.go('map');
        } else {
          $state.go('map.location', { id: model._id });
        }
      }
    };

    $scope.closeSidebar = function () {
      $scope.showSidebar = false;
      $state.go('^');
    };
	
	$timeout(function() {search.filterByFriends = true;}, 1000);

    $scope.$watch('search.filterByFriends', function(filterByFriends){
      if (filterByFriends) {
        $scope.filteredLocations = [];
		$scope.friendsLocations = [];

        for(var i = 0; i < $scope.currentUser.friends.length; i++) {
          $scope.currentUser.friends[i].locations = User.locations({ id: $scope.currentUser.friends[i]._id }, function (locations) {
            _.each(locations, function(location){
              location.cluster = { styles: { url: 'assets/images/Cluster.png' } };
              location.icon = { url: location.details.category.imgUrl };
            });
			$scope.friendsLocations = $scope.friendsLocations.concat(locations);
			
			for(var j = 0; j < $scope.friendsLocations.length; j++) {
				if($scope.friendsLocations[j].details.publication == true || $scope.friendsLocations[j].details.members.indexOf($scope.currentUser._id) !== -1) {
					//do nothing
				} else {
					$scope.friendsLocations.splice(j, 1);
					j--;
				}
			}

            $scope.filteredLocations = $scope.friendsLocations;
          });
        }
      } 
    });
	
    $scope.$watch('search.filterByMyLocations', function(filterByMyLocations){
      if (filterByMyLocations) {
        $scope.filteredLocations = [];

        $scope.currentUser.locations = User.locations({ id: $scope.currentUser._id }, function (locations) {
          _.each(locations, function(location){
            location.icon = { url: location.details.category.imgUrl };
          });

          $scope.filteredLocations = locations;
        });
      } 
    });
	
	$scope.$watch('search.filterByAllRecommendedLocations', function(filterByAllRecommendedLocations){
	  if (filterByAllRecommendedLocations) {
        $scope.filteredLocations = [];
		  $scope.filteredLocations = $scope.locations;
		  for(var i = 0; i < $scope.filteredLocations.length; i++) {
			if($scope.filteredLocations[i].owner.name != 'Admin') {
				$scope.filteredLocations.splice(i, 1);
			}
		  }
		  $scope.filteredLocations = $scope.filteredLocations;
	  } 
    });
	
	$scope.$watch('search.filterByCategory', function(filterByCategory){
	  if (filterByCategory) {
        $scope.filteredLocations = [];
		  $scope.filteredLocations = $scope.locations;
		  for(var i = 0; i < $scope.filteredLocations.length; i++) {
			if($scope.filteredLocations[i].owner.name != 'Admin' && $scope.currentUser.friends.indexOf($scope.filteredLocations[i].owner._id) === -1) {
				$scope.filteredLocations.splice(i, 1);
			}
		  }
		  $scope.filteredLocations = $scope.filteredLocations;
		  $scope.filteredLocations = $filter("filter")($scope.filteredLocations, filterByCategory);
	  } 
    });

    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        $scope.showSidebar = false;
        if ($state.includes('map.*') && !$state.is('map')) {
          $scope.showSidebar = true;
        }
      });

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
	
	$scope.showLocationOnMap = function(latitude, longitude) {
		$scope.search.map = {
            center: {
                latitude: latitude,
                longitude: longitude
            },
            zoom: 14
        };	
	}

    $scope.getLocationBackground = function (location) {
      if (location.details !== undefined) {
        if (location.details.pictures.length > 0) {
          return {
            'background-image': 'linear-gradient(transparent 25%, black), url(' + location.details.pictures[0] + ')',
            'height': '200px'
          }
        } else {
          return {
            /*'height': '75px',
            'margin': 0,
            'margin-left': '-15px',
            'color': 'black'*/
			'background-image': 'linear-gradient(transparent 25%, black), url("http://treasuremap.f4.htw-berlin.de/assets/images/locations/default-location-images/default-' + location.details.category.name + '.png")',
            'height': '200px'
          }
        }
      }
    };
 });

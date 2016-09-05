'use strict';

angular.module('treasuremapApp')
  .controller('LocationCtrl', function ($scope, $stateParams, Location, Auth, User, Lightbox, $modal, $location, $filter, $http, AppConfig, picturesLength, $window) {
    $scope.location = Location.get({ id: $stateParams.id }, function() {
      $scope.map.center.latitude = $scope.location.coordinates.latitude;
      $scope.map.center.longitude = $scope.location.coordinates.longitude;
      $scope.location.details.category.url = $scope.location.details.category.imgUrl;
      $scope.images = $scope.location.details.pictures;
	  picturesLength.setLength($scope.location.details.pictures.length);
    });
	
	$scope.currentUser = Auth.getCurrentUser();
	$scope.isFriend = Auth.isFriend;
	
	$scope.getUser = function(userId) {
		return User.get({ id: userId });
	}
	$scope.member = $scope.getUser();
	
	$scope.cancelEvent = function() {
		$scope.location.details.members.splice($scope.currentUser._id);
		$scope.updateLocation();
	}
	
	//____________________________________________________________
	$scope.updateLocation = function () {
      if ($scope.location === {}) {
        return;
      }

      if ($scope.location.coordinates) {
        $scope.location.details.category = $scope.location.details.category._id;
        $scope.location.owner = $scope.location.owner._id;
        console.log($scope.location);
        $http.put('/api/locations/' + $scope.location._id, $scope.location, { headers: { 'Content-Type': 'application/json'}})
          .success(function (data, status) {
            console.log('Success! ' + status);
            console.log(data);
            $scope.alerts.push({type: 'success', msg: 'New Location successfully added!'});

            $scope.location = {};

            console.log()
            $http.get('/api/categories/'+ data.details.category)
              .success(function (category) {
                data.details.category = category;
                $scope.$close(data);
              });
          })
          .error(function (data, status) {
            console.log('Error!' + status);
            $scope.alerts.push({type: 'danger', msg: 'Couldn\'t edit location!'});
          });
      } else {
		$scope.alerts.push({
              type: 'danger',
              msg: 'Couldn\'t add new location! Please check the fields again!'
        });
      }
    };
	//____________________________________________________________

    $scope.socials = [{
      'name': 'Facebook',
      'icon': 'assets/images/social/facebook.png'
      },{
     'name': 'Twitter',
     'icon': 'assets/images/social/twitter.png'
     },{
       'name': 'Pinterest',
       'icon': 'assets/images/social/pinterest.png'
    }];

    $scope.share = function (service) {
        var title = $scope.location.details.name;
		//var rating = $scope.location.details.rating;
        var desc = $filter('limitTo')($scope.location.details.description, 128);
        var image = $scope.location.details.pictures[0];
        var url = encodeURI($location.absUrl());
        var width = 550;
        var height = 400;
        var top = (screen.height / 2) - (height / 2);
        var left = (screen.width / 2) - (width / 2);
        if(service === 'Facebook'){
           window.open('https://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + desc + '&p[url]=' + url + '&p[images][0]=' + image, 'Share Location', 'top=' + top + ',left=' + left + ',toolbar=0,status=0,width=' + width + ',height=' + height);
        }else if(service === 'Twitter'){
           window.open('https://twitter.com/home?status=' + url, 'Share Location', 'top=' + top + ',left=' + left + ',toolbar=0,status=0,width=' + width + ',height=' + height);
        }else if(service === 'Pinterest'){
           window.open('https://pinterest.com/pin/create/button/?url=' + url + '&media=' + image + '&description=' + desc, 'Share Location', 'top=' + top + ',left=' + left + ',toolbar=0,status=0,width=' + width + ',height=' + height);
        }
     };
	 
	$scope.locations = Location.query();

    $scope.delete = function(location) {
      Location.remove({ id: location._id });
      angular.forEach($scope.locations, function(l, i) {
        if (l === location) {
          $scope.locations.splice(i, 1);
        }
      });
	  $location.path('/');
    };

    $scope.openImage = function (index) {
      Lightbox.openModal($scope.images, index);
    };

    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.openModal = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'app/locations/edit/edit.html',
        controller: 'EditCtrl',
        size: size
      });

      modalInstance.result.then(function (editLocation) {
        $scope.location = editLocation;

        $scope.location.coordinates.latitude = editLocation.coordinates.latitude;
        $scope.location.coordinates.longitude = editLocation.coordinates.longitude;
        $scope.map.center = $scope.location.coordinates;
        //editLocation.cluster = {
        //  styles: { url: 'assets/images/Cluster.png' }
        //};
        //
        $scope.location.details.category.url = editLocation.details.category.imgUrl;

        //
        //$scope.locations.push(editLocation);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.map = {
      center: {
        latitude: 52.5167,
        longitude: 13.3833
      },
      zoom: 15,
      pan: false,
      options: {
        scrollwheel: false,
        draggable: true,
        disableDefaultUI: true
      }
    };
  })
    .controller('DisqusCtrl', function ($scope, $stateParams, Auth, AppConfig) {
        var DISQUS_SECRET = AppConfig.disqus_secret,
            DISQUS_PUBLIC = AppConfig.disqus_public,
            DISQUS_SHORTNAME = AppConfig.disqus_shortname,
            BASEURL = AppConfig.baseurl;

        function disqusSignon(user) {
          var disqusData = {
            id: user._id,
            username: user.name,
            email: user.email
          };

          var disqusStr = JSON.stringify(disqusData);
          var timestamp = Math.round(+new Date() / 1000);

          var message = window.btoa(disqusStr);

          var result = CryptoJS.HmacSHA1(message + ' ' + timestamp, DISQUS_SECRET);
          var hexsig = CryptoJS.enc.Hex.stringify(result);

          return {
            key: DISQUS_PUBLIC,
            auth: message + ' ' + hexsig + ' ' + timestamp
          };
        }

        var hash = disqusSignon(Auth.getCurrentUser());

        var disqus_config = function () {
          this.page.remote_auth_s3 = hash.auth;
          this.page.api_key = hash.key;
          this.sso = {
            name:   'TreasureMap',
            button: BASEURL + '/assets/images/yeoman.png',
            icon:   BASEURL + '/assets/images/yeoman.png',
            url:    BASEURL + '/login',
            logout: BASEURL + '/logout',
            width:  '800',
            height: '400'
          };
        };

        (function() {
          var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//' + DISQUS_SHORTNAME + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
    });
	
angular.module('treasuremapApp')  
  .service('picturesLength', function() {
		var length;

        return {
            getLength: function () {
                return length;
            },
            setLength: function(value) {
                length = value;
            }
        };

  });

'use strict';

angular.module('treasuremapApp')
  .controller('NewCtrl', function($scope, $http, $timeout, $q, uiGmapGoogleMapApi, Auth, $stateParams, AppConfig, FileNewLocationUploadModal, FileUploader, picturesLength,newPicturesId) {
    
	$scope.currentUser = Auth.getCurrentUser();
	
	uiGmapGoogleMapApi.then(function(maps) {
      $timeout(function() {
        $scope.showMap = true;
      }, 100);
    });

    $scope.newLocation = {
      details: {
        imports: '',
        pictures: [],
		members: [],
        links: []
      }
    };
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.mapNew = {
      control: {},
      center: {
        latitude: 52.5075419,
        longitude: 13.4251364
      },
      zoom: 16,
      options: {
        scrollwheel: false,
        disableDefaultUI: true,
        zoomControl: true,
        draggable: false
      }
    };
    $scope.searchboxNew = {
      template: 'searchbox.tpl.html',
      events: {
        places_changed: function(searchBox) {
          $scope.place = searchBox.getPlaces()[0];

          var zipcode = _.find($scope.place.address_components, function(i) {
            return _.contains(i.types, 'postal_code');
          });
          var city = _.find($scope.place.address_components, function(i) {
            return _.contains(i.types, 'administrative_area_level_1') || _.contains(i.types, 'locality');
          });
          var street = _.find($scope.place.address_components, function(i) {
            return _.contains(i.types, 'route');
          });
          var number = _.find($scope.place.address_components, function(i) {
            return _.contains(i.types, 'street_number');
          });
          $scope.newLocation.address.zipcode = zipcode ? zipcode.short_name : '';
          $scope.newLocation.address.city = city ? city.long_name : '';
          $scope.newLocation.address.street = street ? street.long_name : '';
          $scope.newLocation.address.street += number ? ' ' + number.short_name : '';

          $scope.newLocation.coordinates = {
            lat: $scope.place.geometry.location.lat(),
            latitude: $scope.place.geometry.location.lat(),
            lng: $scope.place.geometry.location.lng(),
            longitude: $scope.place.geometry.location.lng()
          };
          $scope.mapNew.center = $scope.newLocation.coordinates;
        }
      }
    };

    $scope.sources = [{
      name: 'Wikipedia',
      url: '//de.wikipedia.org/w/',
      enabled: true
    }];

    function wikiImport(source) {
      var deferred = $q.defer();
      var baseURL = source.url;
      var name = encodeURI($scope.newLocation.details.name);
      if (source.name === 'Wikipedia') {
        $http.jsonp(baseURL + 'api.php?action=query&titles=' + name + '&format=json&redirects&callback=JSON_CALLBACK')
          .success(function(obj) {
            var pageID = Object.keys(obj.query.pages)[0];

            if(pageID != -1) {
            $http.jsonp(baseURL + 'api.php?action=query&pageids=' + pageID + '&prop=info&inprop=url&format=json&callback=JSON_CALLBACK')
              .success(function(data) {
                var objects = data.query.pages;
                for (var key in objects) {
                  var value = objects[key];
                  $scope.newLocation.details.links.push({
                    name: 'Wikipedia',
                    url: value.fullurl
                  });

                  $http.jsonp('http://wikitravel.org/wiki/de/api.php?action=query&list=search&srsearch=' + name + '&srwhat=text&continue&format=json&callback=JSON_CALLBACK')
                    .success(function(data) {
                      if (data.query.search.length >= 1) {
                        $scope.newLocation.details.links.push({
                          name: 'Wikitravel',
                          url: 'http://wikitravel.org/wiki/de/index.php?search=' + name
                        });
                      }
                    })
                    .error(function(data, status) {
                      console.log('Error! ' + status);
                    });

                  $scope.newLocation.details.links.push({
                    name: 'Google',
                    url: 'https://www.google.de/#q=' + name
                  });
                }
              })
              .error(function(data, status) {
                console.log('Error! ' + status);
                deferred.resolve();
              });

            $http.jsonp(baseURL + 'api.php?action=parse&pageid=' + pageID + '&prop=text&section=0&format=json&callback=JSON_CALLBACK')
              .success(function(data) {
                var objects = data.parse.text;
                for (var key in objects) {
                  var value = objects[key];
                  $scope.newLocation.details.imports += value.replace(/href="\//g, 'target="_blank" href="http://de.wikipedia.org/');
                }
              })
              .error(function(data, status) {
                console.log('Error! ' + status);
                deferred.resolve();
              });

            $http.jsonp(baseURL + 'api.php?action=parse&pageid=' + pageID + '&prop=images&section=0&format=json&callback=JSON_CALLBACK')
              .success(function(data) {
                var objects = data.parse.images;
                for (var key in objects) {
                  var title = encodeURI(objects[key]);
                  $http.jsonp(baseURL + 'api.php?action=query&titles=Image:' + title + '&prop=imageinfo&format=json&iiprop=url&callback=JSON_CALLBACK')
                    .success(function(data) {
                      var objects = data.query.pages;
                      for (var key in objects) {
                        var value = objects[key].imageinfo[0].url;
                        $scope.newLocation.details.pictures.push(value);
                        deferred.resolve();
                      }
                    })
                    .error(function(data, status) {
                      console.log('Error! ' + status);
                      deferred.resolve();
                    });
                }
              })
              .error(function(data, status) {
                console.log('Error! ' + status);
                deferred.resolve();
              });
           } else {
             deferred.resolve();
           }
          })
          .error(function(data, status) {
            console.log('Error! ' + status);
            deferred.resolve();
          });
      }
      return deferred.promise;
    }

    $http.get('/api/categories')
      .success(function(categories) {
        $scope.categories = categories;
      })
      .error(function(data, status) {
        console.log('Error!' + status);
        console.log(data);
      });

    $scope.addLocation = function(form) {
      $scope.submitted = true;

      if ($scope.newLocation === {}) {
        return;
      }

      if ($scope.sources[0].enabled) {
        wikiImport($scope.sources[0]).then(function() {
          saveLocation(form);
        });
     } else {
        saveLocation(form);
     }

    };

    $scope.setCategory = function(category) {
      $scope.newLocation.details.category = category;
      $scope.newLocation.details.category.url = category.imgUrl;
    }

    function saveLocation(form) {
      if (form.$valid && $scope.newLocation.coordinates) {
        $scope.newLocation.details.category = $scope.newLocation.details.category._id;
        $http.post('/api/locations', $scope.newLocation)
          .success(function(data, status) {
            console.log('Success! ' + status);
            console.log(data);
            $scope.alerts.push({
              type: 'success',
              msg: 'New Location successfully added!'
            });

            $scope.newLocation = {};

            $http.get('/api/categories/' + data.details.category)
              .success(function(category) {
                data.details.category = category;
                $scope.$close(data);
              });
          })
          .error(function(data, status) {
            console.log('Error! ' + status);
            $scope.alerts.push({
              type: 'danger',
              msg: 'Couldn\'t add new location!'
            });
          });
      } else {
        form.$valid = false;
		$scope.alerts.push({
              type: 'danger',
              msg: 'Couldn\'t add new location! Please check the fields again!'
        });
      }
    }
	
	$scope.invite = function(user) {
	  if($scope.newLocation.details.members.indexOf(user._id) === -1) {
		$scope.newLocation.details.members.push(user._id);
	  } else {
		var index = $scope.newLocation.details.members.indexOf(user._id);
        $scope.newLocation.details.members.splice(index, 1);
	  }
    };
	
	$scope.removePicture = function(pic) {
      var index = $scope.newLocation.details.pictures.indexOf(pic);
      $scope.newLocation.details.pictures.splice(index, 1);
    };

	/*
    var S3_BUCKET = AppConfig.s3_bucket;
    var creds = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AppConfig.aws_cognito,
    });

    AWS.config.update({
      region: AppConfig.aws_region,
      credentials: creds
    });

    var S3 = new AWS.S3({
      //region: s3_region
    });

    $scope.$watch('files', function() {
      $scope.upload($scope.files);
    });

    $scope.upload = function(files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var random = Math.floor((Math.random() * 1000000) + 1);
          var params = {
            Bucket: S3_BUCKET,
            Key: 'images/' + random + file.name,
            ContentLength: file.length,
            ContentType: file.type,
            Body: file
          };
          S3.upload(params, function(err, data) {
            if (err) {
              console.log(err, err.stack);
            } else {
              $scope.newLocation.details.pictures.push(data.Location);
            }
          });
        }
      }
    };*/
	
	newPicturesId.setLength($scope.newLocation.details.pictures.length);
	
	$scope.changeLocationPictures = function (amount) {
		var length = newPicturesId.getLength() + 1;
		var randomId = newPicturesId.getId();
		for(var i=0; i < amount; i++) {
			$scope.newLocation.details.pictures.push('http://localhost:9000/assets/images/locations/' + $scope.currentUser._id + '-' + randomId + length + '.jpg');
			length++;
		}
	};
	
	//UPLOAD-PICTURE-PART ==============================================
	var fileName = '';
	$scope.alerts = [];
	
	$scope.fileUploadOptions = {
      url: '/api/location/upload',
      success: function (fileItem) {
		fileName = fileItem.file.name;
        $scope.alerts.push({
          type: 'success',
          msg: '"' + fileItem.file.name + '" uploaded'
        });
      },
      error: function (fileItem) {
        $scope.alerts.push({
          type: 'danger',
          msg: '"' + fileItem.file.name + '" failed'
        });
      }
    };
	
	/*$scope.showPath = function() {
		alert($scope.currentUser.picture[0]);
	};*/
	
    $scope.open = function () {
      var modal = new FileNewLocationUploadModal($scope.fileUploadOptions);
      modal.open();
    };

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };
	
  });
  
  angular.module('treasuremapApp')  
  .service('newPicturesId', function() {
		var id;
		var length;

        return {
            getId: function () {
                return id;
            },
			setId: function (value) {
				id = value;
			},
			getLength: function () {
                return length;
            },
			setLength: function (value) {
				length = value;
			}
        };

  });
'use strict';

angular.module('treasuremapApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.calendar',
  'ui.bootstrap',
  'uiGmapgoogle-maps',
  'ngFileUpload',
  'angularFileUpload',
  'ae-datetimepicker',
  'ngStorage',
  'bootstrapLightbox',
  'ngTouch'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .config(function(uiGmapGoogleMapApiProvider, AppConfig) {
    uiGmapGoogleMapApiProvider.configure({
        //key: AppConfig.googleapi,
        v: '3.17',
        libraries: 'weather,geometry,places'
    });
  })

  .config(function (LightboxProvider) {
    //LightboxProvider.templateUrl = 'lightbox-template.tpl.html';
    LightboxProvider.getImageUrl = function (imageUrl) {
      return imageUrl;
      }
   })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, last) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) { //next.authenticate && 
          $location.path('/login');
        }
      });

      angular.element('body').removeClass(last.name).addClass(next.name);
    });
  })

  .filter('limitHtml', function() {
    return function(text, limit) {

      var changedString = String(text).replace(/<[^>]+>/gm, '');
      var length = changedString.length;

      return changedString.length > limit ? changedString.substr(0, limit - 1) : changedString;
    }
  });

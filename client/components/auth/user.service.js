'use strict';

angular.module('treasuremapApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      me: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });

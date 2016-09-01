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
      addFriend: {
        method: 'PUT',
        params: {
          controller:'addfriend'
        }
      },
	  addFriend2: {
        method: 'PUT',
        params: {
          controller:'addfriend2'
        }
      },
	  sendRequest: {
        method: 'PUT',
        params: {
          controller:'sendrequest'
        }
      },
	  removeRequest: {
        method: 'PUT',
        params: {
          controller:'removerequest'
        }
      },
      removeFriend: {
        method: 'PUT',
        params: {
          controller:'removefriend'
        }
      },
	  removeFriend2: {
        method: 'PUT',
        params: {
          controller:'removefriend2'
        }
      },
	  saveDescription: {
        method: 'PUT',
        params: {
          controller:'savedescription'
        }
      },
	  saveStatus: {
        method: 'PUT',
        params: {
          controller:'savestatus'
        }
      },
	  saveFriendsLocations: {
        method: 'PUT',
        params: {
          controller:'savefriendslocations'
        }
      },
	  changeProfilePicture: {
        method: 'PUT',
        params: {
          controller:'changeprofilepicture'
        }
      },
      locations: {
        method: 'GET',
        isArray: true,
        params: {
          controller:'locations'
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

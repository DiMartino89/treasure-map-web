'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/changeprofilepicture', auth.isAuthenticated(), controller.changeProfilePicture);
router.put('/:id/addfriend', auth.isAuthenticated(), controller.addFriend);
router.put('/:id/removefriend', auth.isAuthenticated(), controller.removeFriend);
router.put('/:id/addfriend2', auth.isAuthenticated(), controller.addFriend2);
router.put('/:id/removefriend2', auth.isAuthenticated(), controller.removeFriend2);
router.put('/:id/sendrequest', auth.isAuthenticated(), controller.sendRequest);
router.put('/:id/removerequest', auth.isAuthenticated(), controller.removeRequest);
router.put('/:id/savedescription', auth.isAuthenticated(), controller.saveDescription);
router.put('/:id/savestatus', auth.isAuthenticated(), controller.saveStatus);
router.put('/:id/savefriendslocations', auth.isAuthenticated(), controller.saveFriendsLocations);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id/locations', auth.isAuthenticated(), controller.locations);
router.post('/', controller.create);

module.exports = router;

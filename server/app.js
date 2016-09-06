/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
//var moment = require('moment-timezone');
//moment().tz("Europe/Berlin").format();

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;

// Include components to chat
var socket  = require( '../node_modules/socket.io' );	
var io = require('socket.io')(server);

// Include components for image uploads
var busboy = require('connect-busboy');
var path = require('path');
var fs = require('fs-extra');

app.use(busboy());
app.use(express.static(path.join(__dirname, '../client/components')));
app.use(express.static(path.join(__dirname, '../client/')));
//app.use(express.static(path.join(__dirname, '.tmp')));

/*
*  Chat-Tutorial and © by Ashik Basheer, from 26th of March 2016, Source: http://www.jqueryajaxphp.com/private-messaging-with-socket-io-and-angularjs/ (abgerufen am 18.08.2016)
*/

// Chat 
app.use(express.static(path.join(__dirname)));

var users = [];
io.on('connection', function(socket){
	socket.on('newuser', function(data,status){
		var userExist = users.filter(function(item) { return item.nickname === data.nickname; });
	  	if(userExist.length > 0){
	  		status({status:false});
	  	} else{
	  		socket.nickname = data.nickname;
	  		var obj = {
	  			nickname: data.nickname,
				id: data.id,
	  			socketid: socket.id,
	  			emailhash: data.emailhash
	  		};
	  		users.push(obj);
	  		status({status:true});
	  		emitusers();
	  	}
	});

	socket.on('sendmessage',function(data){
		io.to(data.receiver).emit('receivemessage', {sender:socket.id,nickname:socket.nickname,message:data.message});
	});

	socket.on('disconnect', function(){
	    users = users.filter(function(item) { return item.nickname !== socket.nickname; });
	    emitusers();
	});

	function emitusers(){
		setTimeout(function(){
			io.emit('users',users);
		}, 1000);
	}
});
	
/*
*  Image Upload-Tutorial by Gautam Anand, Source: http://blog.gautamanand.in/uploading-files-with-nodejs-handling-using-fs/ (abgerufen am 19.07.2016)
*/

	
// Image Upload
	// Profile Pictures
	app.route('/api/user/upload')
	  .post(function (req, res) {
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
		  var stream = fs.createWriteStream(__dirname + '/api/user/upload/' + filename);
		  file.pipe(stream);
		  fs.copy(__dirname + '/api/user/upload/' + filename, app.get('appPath') + '/assets/images/users/' + filename, function (err) {
			  if (err) {
				console.error(err);
			  } else {
				console.log("successfully copied image!");
			  }
		  });
		  stream.on('close', function () {
			console.log('File ' + filename + ' is uploaded');
			res.json({
			  filename: filename
			});
		  });
		});
	  });
	
	// Location Pictures
	app.route('/api/location/upload')
	  .post(function (req, res) {
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
		  var stream = fs.createWriteStream(__dirname + '/api/location/upload/' + filename);
		  file.pipe(stream);
		  fs.copy(__dirname + '/api/location/upload/' + filename, app.get('appPath') + '/assets/images/locations/' + filename, function (err) {
			  if (err) {
				console.error(err);
			  } else {
				console.log("successfully copied image!");
			  }
		  });
		  stream.on('close', function () {
			console.log('File ' + filename + ' is uploaded');
			res.json({
			  filename: filename
			});
		  });
		});
	  });
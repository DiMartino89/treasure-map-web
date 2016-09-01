'use strict';
var app = angular.module('treasuremapApp');
var socket, nickname, id;

app.controller('ChatCtrl', function ($scope, $location, $modal, Auth, search, Locator, $timeout, $state, $http) {
   
   $scope.getCurrentUser = Auth.getCurrentUser();
   $scope.isFriend = Auth.isFriend;
   $scope.isLoggedIn = Auth.isLoggedIn;
   
   socket = io.connect('http://localhost:9000');
   var hash = CryptoJS.MD5($scope.getCurrentUser.email);
   socket.emit('newuser',{nickname: $scope.getCurrentUser.name, id: $scope.getCurrentUser._id, emailhash: String(hash)},function(data){
		if(data.status == true){
            nickname = $scope.getCurrentUser.name;
			id = $scope.getCurrentUser._id;
        } else {
            //do nothing
        }
   });

   var messages = {};
   $scope.mynickname = $scope.getCurrentUser.name;
   $scope.activeChat = false;
   $scope.emptyChat = true;

   socket.on('users',function(users){
      $scope.$apply(function(){
         $scope.mysocketid = localStorage.getItem('socketid');
         $scope.users = users.filter(function(item) { return item.nickname !== $scope.getCurrentUser.name; });
         if(users.filter(function(item) { return item.nickname === $scope.selectedUser; }).length == 0){
            $scope.emptyChat = true;
            $scope.activeChat = false;
            $scope.conversation = [];
         }
      });
   });

   $scope.loadChat = function(data){ 
          $scope.msgcount = 0;
          $scope.rec_socketid = data.currentTarget.attributes.socketid.value;
          $scope.selectedUser = data.currentTarget.attributes.nickname.value;
          angular.element(document.querySelector('li[nickname="'+$scope.selectedUser+'"]')).removeClass('pending');
          $scope.emptyChat = false;
          $scope.activeChat = true;
          $scope.conversation = messages[$scope.selectedUser];
          if($scope.conversation !== undefined){
            $scope.msgcount = ($scope.conversation).length;
            $scope.scrollToBottom();
          }
   }

   $scope.sendMessage = function(data){
      if($scope.message == '') return false;
      $scope.pushMessage($scope.selectedUser,nickname,$scope.message);
      socket.emit('sendmessage',{message:$scope.message,receiver:$scope.rec_socketid});
      $scope.message = '';
      $timeout(function(){
          $scope.conversation = messages[$scope.selectedUser];
          $scope.msgcount = ($scope.conversation).length;
          $scope.scrollToBottom2();
      }, 100);
   }

   socket.on('receivemessage',function(data){ 
      $scope.pushMessage(data.nickname,data.nickname,data.message);
      if($scope.selectedUser == undefined || $scope.selectedUser != data.nickname){         
         angular.element(document.querySelector('li[nickname="'+data.nickname+'"]')).addClass('pending');
      }
      
      $timeout(function(){
        if($scope.selectedUser == data.nickname){
          $scope.conversation = messages[data.nickname];
          $scope.msgcount = ($scope.conversation).length;
          $scope.scrollToBottom();
        }
      }, 100);
   });
   
   $scope.pushMessage = function(p_nickname,p_from,p_message){
      if(messages.hasOwnProperty(p_nickname)){
      } else{
         messages[p_nickname] = [];
      }
      var msg = {
         from: p_from,
         message: p_message,
         time: Math.round((new Date() / 1000))
      };
	  messages[p_nickname].push(msg);
	}

   $scope.scrollToBottom = function(){
      $timeout(function() {
        var scroller = document.getElementById("chat-data");
        scroller.scrollTop = scroller.scrollHeight;
      }, 0, false);
   }
});
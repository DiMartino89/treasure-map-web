'use strict';

angular.module('treasuremapApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, FileUploadModal, FileUploader) {
   $scope.currentUser = Auth.getCurrentUser();
	$scope.newPicture = "";
    $scope.errors = {};
	$scope.alerts = [];

    //CHANGE-PASSWORD-PART ==============================================
	
	$scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
	};
	
	$scope.saveStatus = function () {
		Auth.saveStatus($scope.user.newStatus).then( function() {
			$scope.currentUser.status = $scope.user.newStatus;
		});
    };
	
	$scope.saveDescription = function () {
		Auth.saveDescription($scope.user.newDescription).then( function() {
			$scope.currentUser.description = $scope.user.newDescription;
		});
    };
	
	//UPLOAD-PICTURE-PART ==============================================
	var fileName = '';
	
	$scope.fileUploadOptions = {
      url: '/api/user/upload',
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
	
	$scope.showPath = function() {
		alert($scope.currentUser.picture[0]);
	};
	
	/*$scope.showNewImage = function(oldvalue, value) {
		alert(oldvalue + ", " + value);
	};*/

    $scope.open = function () {
      var modal = new FileUploadModal($scope.fileUploadOptions);
      modal.open();
    };

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };
	
  });

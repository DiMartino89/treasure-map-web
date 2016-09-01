'use strict';


    // Angular File Upload module does not include this directive
    // Only for example


    /**
    * The ng-thumb directive
    * @author: nerv
    * @version: 0.1.2, 2014-01-09
    */
var username = '';	
var fileName = '';
	
angular.module('treasuremapApp')
  .controller('UploadCtrl', function ($scope, Auth) {
	  $scope.getCurrUsername = function(currUser){
		  username = currUser;
	  }
	  
	  $scope.changeProfilePicture = function (oldPicture, newPicture) {
		newPicture = 'http://localhost:9000/assets/images/users/' + fileName;
		Auth.changeProfilePicture(oldPicture, newPicture)
		.then( function() {
			$scope.currentUser.picture.splice($scope.currentUser.picture.indexOf(oldPicture), 1);
			$scope.currentUser.picture.push(newPicture);
			$scope.confirmMessage = 'Profile picture successfully changed.';
		});
	  };
  })
  .directive('fileUpload', function (FileUploader, $timeout) {	
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'app/account/settings/file-upload.html',
      scope: true,
      link: function (scope, element, attrs) {
        var options = scope.$eval(attrs.fileUpload);

        if (!options || !options.url) {
          throw 'Upload URL is not set';
        }

        var uploader = new FileUploader({
          url: options.url
        });
        scope.uploader = uploader;

        scope.uploading = false;

        angular.extend(uploader, {
          onAfterAddingFile: function (fileItem) {
			var fileExtension = '.' + fileItem.file.name.split('.').pop();
			fileItem.file.name = username + fileExtension;
			fileName = fileItem.file.name;
            scope.alert = null;
            scope.uploading = true;
            uploader.uploadAll();
          },
          onProgressAll: function (progress) {
            scope.progress = progress;
          },
          onSuccessItem: function (fileItem) {
            scope.uploading = false;
			
            scope.alert = {
              type: 'success',
              msg: 'File "' + fileItem.file.name + '" is successfully uploaded'
            };

            if (options.success) {
              options.success(fileItem);
            }
          },
          onErrorItem: function (fileItem, response, status) {
            console.log(fileItem);
            scope.uploading = false;

            scope.alert = {
              type: 'danger',
              msg: 'File "' + fileItem.file.name + '" upload failed',
              details: status + ' ' + response
            };

            if (options.error) {
              options.error(fileItem);
            }
          }
        });
		
        scope.closeAlert = function () {
          scope.alert = null;
        };

        scope.selectFile = function () {
          $timeout(function () {
            element.find('input').trigger('click');
          }, 0);
        };
      }
    };
  })
  .factory('FileUploadModal', function ($modal) {
    function FileUploadModal(fileUploadOptions) {
      this.fileUploadOptions = fileUploadOptions;
    }

    angular.extend(FileUploadModal.prototype, {
      open: function () {
        var fileUploadOptions = this.fileUploadOptions;

        $modal.open({
          templateUrl: 'app/account/settings/file-upload-modal.html',
          controller: 'ModalInstanceCtrl',
          size: 'lg',
          resolve: {
            fileUploadOptions: function () {
              return fileUploadOptions;
            }
          }
        });
      }
    });

    return FileUploadModal;
  })
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, fileUploadOptions) {
    $scope.fileUploadOptions = {};

    angular.extend($scope.fileUploadOptions, fileUploadOptions);

    //override success callback to close the modal
    angular.extend($scope.fileUploadOptions, {
      success: function (fileItem) {
        $modalInstance.close(fileItem.file.name);

        if (fileUploadOptions.success) {
          fileUploadOptions.success(fileItem);
        }
      }
    });

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
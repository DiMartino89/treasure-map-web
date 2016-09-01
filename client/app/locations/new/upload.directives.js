'use strict';


    // Angular File Upload module does not include this directive
    // Only for example


    /**
    * The ng-thumb directive
    * @author: nerv
    * @version: 0.1.2, 2014-01-09
    */
var randomId;
var userId;
var length;
	
angular.module('treasuremapApp')
  .controller('LocationNewUploadCtrl', function ($scope, Auth, $stateParams, picturesLength, newPicturesId) {
	  randomId = Math.floor((Math.random() * 10000) + 1);
	  length = newPicturesId.getLength() + 1;
	  newPicturesId.setId(randomId);
	  $scope.currentUser = Auth.getCurrentUser();
	  userId = $scope.currentUser._id;	  
  })
  .directive('fileNewLocationUpload', function (FileUploader, $timeout) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'app/locations/new/file-upload.html',
      scope: true,
      link: function (scope, element, attrs) {
        var options = scope.$eval(attrs.fileNewLocationUpload);

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
					uploader.queue.push(fileItem);
					var fileExtension = '.' + fileItem.file.name.split('.').pop();
					fileItem.file.name = userId + '-' + randomId + length + fileExtension;
					length++;
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
  .factory('FileNewLocationUploadModal', function ($modal) {
    function FileNewLocationUploadModal(fileUploadOptions) {
      this.fileUploadOptions = fileUploadOptions;
    }

    angular.extend(FileNewLocationUploadModal.prototype, {
      open: function () {
        var fileUploadOptions = this.fileUploadOptions;

        $modal.open({
          templateUrl: 'app/locations/new/file-upload-modal.html',
          controller: 'ModalInstanceCtrl3',
          size: 'lg',
          resolve: {
            fileUploadOptions: function () {
              return fileUploadOptions;
            }
          }
        });
      }
    });

    return FileNewLocationUploadModal;
  })
  .controller('ModalInstanceCtrl3', function ($scope, $modalInstance, fileUploadOptions) {
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
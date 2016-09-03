'use strict';


    // Angular File Upload module does not include this directive
	// Modified Directive from Source: https://github.com/nervgh/angular-file-upload (abgerufen am 21.07.2016), basically integrated as a Bower-Component and Node-Module
    
	/*
    * The ng-thumb directive
    * @author: nerv
    * @version: 0.1.2, 2014-01-09
    */
var locationname = '';
var length;
	
angular.module('treasuremapApp')
  .controller('LocationEditUploadCtrl', function ($scope, Auth, $stateParams, picturesLength) {
	  locationname = $stateParams.id;
	  $scope.length = picturesLength.getLength();
	  length = $scope.length + 1;
  })
  .directive('fileEditLocationUpload', function (FileUploader, $timeout) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'app/locations/edit/file-upload.html',
      scope: true,
      link: function (scope, element, attrs) {
        var options = scope.$eval(attrs.fileEditLocationUpload);

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
					fileItem.file.name = locationname + length + fileExtension;
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
  .factory('FileEditLocationUploadModal', function ($modal) {
    function FileEditLocationUploadModal(fileUploadOptions) {
      this.fileUploadOptions = fileUploadOptions;
    }

    angular.extend(FileEditLocationUploadModal.prototype, {
      open: function () {
        var fileUploadOptions = this.fileUploadOptions;

        $modal.open({
          templateUrl: 'app/locations/edit/file-upload-modal.html',
          controller: 'ModalInstanceCtrl2',
          size: 'lg',
          resolve: {
            fileUploadOptions: function () {
              return fileUploadOptions;
            }
          }
        });
      }
    });

    return FileEditLocationUploadModal;
  })
  .controller('ModalInstanceCtrl2', function ($scope, $modalInstance, fileUploadOptions) {
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
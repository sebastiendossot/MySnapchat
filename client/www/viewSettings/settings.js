'use strict';

angular.module('myApp.settings', ['ngRoute', 'angularFileUpload'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/settings', {
		templateUrl: 'viewSettings/settings.html',
		controller: 'SettingsCtrl',
		isPrivate: true
	});
}])

.controller('SettingsCtrl', ['$scope', 'userWebService', 'User', '$location',
	function($scope, userWebService, User, $location)  {
		console.log(User)
		$scope.User = User;
		$scope.callback = {
			title:'',
			content:''
		}

		$scope.setErrorCallback = function() {
			$scope.callback.title = "Erreur";
			$scope.callback.content = "Un problème inattendu est survenu, veuillez réessayer plus tard.";
		}
		
		$scope.pressRemoveAccount = function() {
			console.log("User confirmed the removal of his account");
			$('#removeConfirmation').modal('hide')
			var success = function() {
				$scope.callback.title = "Succès";
				$scope.callback.content = "Votre compte a bien été supprimé. Merci d'avoir utilisé MySnapchat";
				$('#callbackDialog').modal('show')
				$('#callbackDialog').on('hidden.bs.modal', function (e) {
					User.logout();
					window.location.assign('#/login') 
				})
			}
			var error = function() {
				$scope.setErrorCallback()
				$('#callbackDialog').modal('show')
			}
			userWebService.unsubscribe({}, success, error);
		}

		$scope.updateDescription = function() {
			var success = function() {
				$scope.User.description = $scope.newDescription
				User.update("description", $scope.User.description)
				console.log("description updated" + $scope.User.description)
				$scope.newDescription=""
			}
			var error = function() {
				console.log("description failed to update")
			}
			userWebService.putDescription({description: $scope.newDescription}, success, error)
		}

		$scope.oldPassword = ""
		$scope.newPassword = ""
		$scope.confirmPassword = ""

		$scope.initPassword = function () {
			$scope.oldPassword = ""
			$scope.newPassword = ""
			$scope.confirmPassword = ""
		}

		$scope.changePassword = function () {
			$('#changePassword').modal('hide')
			var success = function() {
				$scope.initPassword()
				$scope.callback.title = "Succès";
				$scope.callback.content = "Votre nouveau mot de passe a été enregistré.";
				$('#callbackDialog').modal('show')
			}
			var error = function() {
				$scope.initPassword()
				$scope.setErrorCallback()
				$('#callbackDialog').modal('show')
			}
			userWebService.putPassword({oldPassword: $scope.oldPassword, newPassword: $scope.newPassword}, success, error)
		}

		$scope.$watch('file', function () {

			//$scope.User.urlImg = User.img;
			if($scope.file && $scope.file[0]) {
				var reader  = new FileReader();

				reader.onload = function(fileLoadedEvent) 
				{	
					$scope.User.imgUrl = fileLoadedEvent.target.result;
					$scope.$apply();
				};
				reader.readAsDataURL($scope.file[0])
			}
		});

		$scope.uploadImg = function (file) {
			if ($scope.User.imgUrl) {
				var error = function() {
					$scope.setErrorCallback()
					$('#callbackDialog').modal('show')
				};
				var success = function(data) {
					User.update("imgUrl", $scope.User.imgUrl)
					$scope.callback.title = "Succès";
					$scope.callback.content = "Votre image de profil a bien été mise à jour";
					$('#callbackDialog').modal('show')
				}
				userWebService.putProfileImg({imgUrl:$scope.User.imgUrl}, success, error)
			}
		};
	}]);
/*$scope.uploader = new FileUploader({
	url: '/api/user/picture',
	method: 'PUT',
	filters: [
	{name: 'imageFilter',
	fn: function(item, options) {
		var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|'
		return '|jpg|png|jpeg|bmp|'.indexOf(type) !== -1
	}
},
{name :'sizeFilter',
fn: function(item, options) {
	return item.size < 100000
}
}
]})

$scope.clearQueue = function(){
	$scope.uploader.clearQueue()
}

$scope.savePicture = function(item) {
	$scope.uploader.uploadAll()
	$scope.uploader.onSuccesItem = function(fileItem, response, status, headers) {
		console.info('onSuccessItem', fileItem, response, status, headers);
	};
	$scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
		console.info('onErrorItem', fileItem, response, status, headers);
	};
		/*var success = function() {
		    console.log("success")
		}
		var error = function() {
		    console.log("error")
		}
		userWebService.putPicture({picture: item}, success, error)
	}
	*/

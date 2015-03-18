'use strict';

angular.module('myApp.settings', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/settings', {
		templateUrl: 'viewSettings/settings.html',
		controller: 'SettingsCtrl',
		isPrivate: true
	});
}])

.controller('SettingsCtrl', ['$scope', 'userWebService', 'User', '$location',
	function($scope, userWebService, User, $location)  {
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

	    $scope.description = User.description

	    $scope.updateDescription = function() {
		User.description = $scope.description
		var success = function() {
		    console.log("description updated")
		}
		var error = function() {
		    console.log("description failed to update")
		}
		userWebService.putDescription({description: $scope.description}, success, error)
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

	}]);

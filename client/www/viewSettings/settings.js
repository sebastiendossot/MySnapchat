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
			$scope.callback.content = "Un problème inattendu est survenu, veuillez réessayer plus tard";
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
					window.location.assign('/login') 
				})
			}
			var error = function() {
				$scope.setErrorCallback()
				$('#callbackDialog').modal('show')
			}
			userWebService.unsubscribe({}, success, error);
		}

	}]);
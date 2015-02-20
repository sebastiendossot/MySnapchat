'use strict';

angular.module('myApp.settings', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/settings', {
		templateUrl: 'viewSettings/settings.html',
		controller: 'SettingsCtrl'
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

		$scope.pressLogout = function() {
			console.log("Logout button just pressed")
			var success = function() {
				User.deconnection();
				$location.assign('#/connection')
			}
			var error = function() {
				$scope.setErrorCallback()
				$('#callbackDialog').modal('show')
			}

			userWebService.logout({}, success, error);
		}

		$scope.pressRemoveAccount = function() {
			console.log("User confirmed the removal of his account");
			$('#removeConfirmation').modal('hide')
			var success = function() {
				$scope.callback.title = "Succès";
				$scope.callback.content = "Votre compte a bien été supprimé. Merci d'avoir utilisé MySnapchat";
				$('#callbackDialog').modal('show')
				$('#callbackDialog').on('hidden.bs.modal', function (e) {
					alert("Redirection vers #/connection") // A supprimer plus tard
					$location.assign('#/connection')
				})
			}
			var error = function() {
				$scope.setErrorCallback()
				$('#callbackDialog').modal('show')
			}
			userWebService.delete({}, success, error);
		}

	}]);
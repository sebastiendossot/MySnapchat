'use strict';

angular.module('myApp.viewNavBar', [])

.controller('navBarCtrl', ['$scope', 'User', 
	function($scope, User) {

		$scope.connected = User.connected
		$scope.name = User.name

		$scope.logout = function() {
			console.log("Logout button just pressed")
			var success = function() {
				User.logout();
				$scope.connected = User.connected
				$scope.name = User.name
				$location.assign('#/connection')
			}
			var error = function() {
				$scope.setErrorCallback()
				$('#callbackDialog').modal('show')
			}

			userWebService.logout({}, success, error);
		}
	}])

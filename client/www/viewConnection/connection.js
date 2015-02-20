'use strict';

angular.module('myApp.viewConnection', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/connection', {
		templateUrl: 'viewConnection/viewConnection.html',
		controller: 'connectionCtrl'
	})
}])

.controller('connectionCtrl', ['$scope', 'userWebService', 'User', 
	function($scope, userWebService, User) {

		$scope.pseudo = ""
		$scope.password = ""
		$scope.error = false

		$scope.login = function() {
			var success = function(data) {
				if (!data) {
					$scope.error = true
				}
				else {
					User.login(data)
				//window.location.assign('#/home')
			}
			var error = function(data) {
				$scope.error = true
				// differenciate the type of error ?
			}

		}
		// what ?
	}

}])


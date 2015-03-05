'use strict';

angular.module('myApp.viewConnection', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
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
				console.log(data)
				if (!data.user) {
					$scope.error = true
				}
				else {
					User.login(data)
					window.location.assign('#/friendlist')	
				}
			}
			var error = function(data) {
				$scope.error = true
				// TODO : differenciate the type of error ?
			}
			userWebService.login({pseudo:$scope.pseudo, password:$scope.password}, success, error)
		}
	}]);




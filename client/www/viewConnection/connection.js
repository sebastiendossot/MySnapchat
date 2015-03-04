'use strict';

angular.module('myApp.viewConnection', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/connection', {
		templateUrl: 'viewConnection/viewConnection.html',
		controller: 'connectionCtrl'
	})
}])

.controller('connectionCtrl', ['$scope', /*'userWebService'*/'$http', 'User', 
	function($scope, /*userWebService*/$http, User) {

		$scope.pseudo = ""
		$scope.password = ""
		$scope.error = false

		$scope.login = function() {
			$http.post('api/connection', {name:$scope.pseudo, password:$scope.password}).success(function(data) {
				if (!data) {
					$scope.error = true
				}
				else {
					User.login(data)
					window.location.assign('#/friendlist')	
				}

			})
			.error(function(data) {
				$scope.error = true
				// differenciate the type of error ?
			})
			//userWebService.login({name:$scope.pseudo, password:$scope.password}, success, error)
		}
		// what ?
	}])




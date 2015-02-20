'use strict';

angular.module('myApp.viewNavBar', [])

    .controller('navBarCtrl', ['$scope', 'User', 
	function($scope, User) {

	    $scope.connected = User.connected
	    $scope.name = User.name

	    $scope.logout = function() {
		User.logout()
		$scope.connected = User.connected
	    	$scope.name = User.name
		}
	}])

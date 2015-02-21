'use strict';

angular.module('myApp.viewNavBar', [])

.controller('navBarCtrl', ['$scope', '$http', 'User', 
	function($scope, $http, User) {

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
		
		// Permet d'afficher une notification en cas de nouvelle demande d'amis
		User.id = "507f191e810c19729de860ea"; // A supprimer
		$http.get('/api/requests/'+User.id)
		.success(function(data) {
		   $scope.notifications = data.length;
		})
		.error(function(data) {
			console.log("erreur lors de la récupération du nombre de demande d'amis");
		})
		
	}])

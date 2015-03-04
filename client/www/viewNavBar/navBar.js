'use strict';

angular.module('myApp.viewNavBar', [])

.controller('navBarCtrl', ['$scope', '$http', 'User', 
	function($scope, $http, User) {

		$scope.user = User

		$scope.logout = function() {
			User.logout()
			window.location.assign('#/connection')
		}

		/*function() {
			console.log("Logout button just pressed")
			var success = function() {
				User.logout();
				$location.assign('#/connection')
			}
			var error = function() {
				$scope.setErrorCallback()
				$('#callbackDialog').modal('show')
			}

			userWebService.logout({}, success, error);
		}*/
		 // logout n'a pas de requete sur la bd ?


		// Permet d'afficher une notification en cas de nouvelle demande d'amis
		if(User.id != "")
		{
			$http.get('/api/requests/'+User.id)
			.success(function(data) {
				$scope.notifications = data.length;
			})
			.error(function(data) {
				console.log("erreur lors de la récupération du nombre de demande d'amis");
			})
		}
	}])

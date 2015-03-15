'use strict';

angular.module('myApp.viewNavBar', ['ngRoute'])

.controller('navBarCtrl', ['$scope', 'User', 'socialWebService', '$location', '$route',
	function($scope, User, socialWebService, $location, $route) {

		$scope.user = User

		$scope.logout = function() {
			User.logout()
			window.location.assign('#/login')
		}

		
	    // Permet d'afficher une notification en cas de nouvelle demande d'amis
	    $scope.reload_notifications = function () {
	    	if(User.id != "")
	    	{
	    		var success = function(data) {
	    			$scope.notifications = data.list.length;
	    		}
	    		var error = function(data) {
	    			console.error("erreur lors de la récupération du nombre de demande d'amis");
	    		}
	    		socialWebService.receivedRequests(null, success, error)
	    	}
	    }
	    

	    //Forces the browser to reload the page
	    $scope.brandButtonPressed = function() {
	    	window.location.reload()
	    }

	    
	}])

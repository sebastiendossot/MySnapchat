'use strict';

angular.module('myApp.viewConnection', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/connection', {
	    templateUrl: 'viewConnection/viewConnection.html',
	    controller: 'connectionCtrl'
	})
    }])

    .controller('connectionCtrl', ['$scope', '$http', 'User', 
	function($scope, $http, User) {

	    $scope.pseudo = ""
	    $scope.password = ""
	    $scope.error = false
	    
	    $scope.connect = function() {
		$http.post('/api/connection/', {'nom' : $scope.pseudo, 'mdp' : $scope.password})
		    .success(function(data) {
			if (!data) {
			    $scope.error = true
			}
			else {
			    User.login(data)
			    //window.location.assign('#/home')
			}
		    }).error(function(data) {
			$scope.error = true
			// differenciate the type of error ?
		    })
	    }
	    
	}])

    .factory('User', function() {
	return {

	    connected : false,
	    id : "",
	    name : "",
	    mail : "",
	    description : "",

	    login : function(doc) {
		connected = true
		id = doc.id
		name = doc.nom
		mail = doc.mail
		description = doc.description
	    },

	    logout : function() {
		connected : false
		id : ""
		name : ""
		mail : ""
		description : ""
	    }
  
	}
    })

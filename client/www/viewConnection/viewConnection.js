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
		$http.get('/api/connection/'+$scope.pseudo+'/'+$scope.password)
		    .success(function(data) {
			if (!data) {
			    console.log('nop....')
			    $scope.error = true
			}
			else {
			    User.connection(data)
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

	    connected : false
	    id : ""
	    name : ""
	    mail : ""
	    description : ""

	    connection : function(doc) {
		connected = true
		id = doc.id
		name = doc.nom
		mail = doc.mail
		description = doc.description
	    }

	    deconnection : function() {
		connected : false
		id : ""
		name : ""
		mail : ""
		description : ""
	    }
  
	}
    })

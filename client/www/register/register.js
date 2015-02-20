'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'Register2Ctrl'
  });
}])

.controller('Register2Ctrl', [function(){
    
	$scope.registerUser = function() {
        $http.post('/api/utilisateur', $scope.register)
            .success(function(data) {
               if (!data) {
			    console.log('ca marche pas ')
			    $scope.error = true;
			}
			else {
			     console.log('je suis laaaa')
			}
            })
            .error(function(data) {
                $scope.error = true;
            })
    }
	    
	}])





/* $scope.connect = function() {
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
	    
	}])*/

'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'Register2Ctrl'
  });
}])
.controller('Register2Ctrl',['$scope', '$http', function($scope,$http) {
	$scope.registerUser = function() {
        $http.post('/api/utilisateur', jdata)

    .success(function(data) {
               if (!data) {
			    console.log('Warning')
			    $scope.error = true;
			}
			else {                                                      
			     console.log('saving...')
			}
            })
            .error(function(data) {
                $scope.error = true;
            })

            function formData( req, res, next){
    	req.body.mail=$scope.email;   
    	req.body.nom=$scope.pseudo;
    	req.body.mdp=$scope.pwd;    	
     }
       // to reset 
    	$scope.pseudo = '';
        $scope.pwd = '';
        $scope.pwd1 = '';
        $scope.email = '';
    
     var jdata = 'mydata='+JSON.stringify(formData);
 }	    
}])


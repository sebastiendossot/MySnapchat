'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'Register2Ctrl'
  });
}])
   // just for form control 
.directive('equalsTo', [function () {    
    return {
        restrict: 'A', 
        scope: true,
        require: 'ngModel',
        link: function (scope, elem, attrs, control) {
            var check = function () {               
                var v1 = scope.$eval(attrs.ngModel);                 
                var v2 = scope.$eval(attrs.equalsTo).$viewValue;
                return v1 == v2;
            };
            scope.$watch(check, function (isValid) {
               
                control.$setValidity("equalsTo", isValid);
            });
        }
    };
}])
.controller('Register2Ctrl',['$scope', '$http', function($scope,$http) {
	$scope.registerUser = function() {    

      	  $http.post('/api/utilisateur',  {
		'nom' : $scope.pseudo,
    		'mail': $scope.email,    	
    		'mdp': $scope.pwd    	
    		 })
    		.success(function(data) {
              window.location.assign('#/connection')	
            })
            .error(function(data) {
                $scope.error = true;
            })
      
    	$scope.pseudo = '';
        $scope.pwd = '';
        $scope.pwd1 = '';
        $scope.email = '';     
    
    
 }	    
	    
}])


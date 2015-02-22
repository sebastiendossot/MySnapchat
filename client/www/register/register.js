'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'Register2Ctrl'
  });
}])
.directive('equalsTo', [function () {    
    return {
        restrict: 'A', 
        scope: true,
        require: 'ngModel',
        link: function (scope, elem, attrs, control) {
            var check = function () {               
                var v1 = scope.$eval(attrs.ngModel); // attrs.ngModel = “pwd1”
                //champ à comparer
                var v2 = scope.$eval(attrs.equalsTo).$viewValue; // attrs.equalsTo = “pwd”
                return v1 == v2;
            };
            scope.$watch(check, function (isValid) {
                // Défini si le champ est valide
                control.$setValidity("equalsTo", isValid);
            });
        }
    };
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


'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'viewRegister/register.html',
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
   .controller('Register2Ctrl',['$scope', 'userWebService', function($scope, userWebService) {

    $scope.pseudo = ''
    $scope.pwd = ''
    $scope.pwd1 = ''
    $scope.email = ''     
    $scope.error = 0 

    $scope.registerUser = function() {
        var success = function(data) {
            window.location.assign('#/login')  
        }
        var error = function(data, status) {
            //409 = conflict. Means this pseudo is already used
            if(status === 409) {
                $scope.error = 2
            } else {
                $scope.error = 1
            }
        }
        userWebService.subscribe({
            pseudo: $scope.pseudo,
            email: $scope.email,       
            pwd: $scope.pwd,
	    description: "",
	    temps: {texte: 60, image: 60, video: 60}
        }, success, error);
    }
}])


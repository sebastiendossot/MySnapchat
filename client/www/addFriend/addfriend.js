'use strict';

angular.module('myApp.addfriend', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addfriend', {
    templateUrl: 'addFriend/addfriend.html',
    controller: 'addfriendCtrl',
    isPrivate: true
  });
}])

.controller('addfriendCtrl', ['$scope', 'socialWebService', 'User', function($scope, socialWebService, User) {  

  $scope.addfriend = function() {
    var pseudo = $scope.searchInfo;

    var success = function(friend) {
      window.location.assign('#/friendlist')  
    }
    var error = function(data, status, headers){
      if(data.status === 404) {
        alert("Utilisateur inconnu");
      }
      console.error(data);
    }

    /*Directly launch the new friendship to server. Server will return error 404 if the
    pseudo the user entered is invalid*/
    socialWebService.newFriend({'pseudo' : pseudo}, success, error)

    $scope.searchInfo ="";
  }

}]);


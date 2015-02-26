'use strict';

angular.module('myApp.addfriend', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addfriend', {
    templateUrl: 'addFriend/addfriend.html',
    controller: 'addfriendCtrl'
  });
}])

.controller('addfriendCtrl', ['$scope','$http', 'User',function($scope,$http,User) {

  //alert("test ");
  console.log(User.login.id);
   
   $scope.addfriend = function(){
   	/*console.log("1");
   	$http.post('api/ami').
   	succes(function(data){
   		   	console.log("2");
           alert("test ok");               
   	}).error(function(data){
   			console.log("3");
   		alert("ERRRRRRRRRRRRRRRRRRRRRReur");
   	});console.log(User.login.id);
*/
//alert(User.id); ok
alert($scope.searchInfo)
   }


}]);

// $scope.searchInfo.idAmi1
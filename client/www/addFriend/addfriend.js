'use strict';

angular.module('myApp.addfriend', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addfriend', {
    templateUrl: 'addFriend/addfriend.html',
    controller: 'addfriendCtrl'
  });
}])

.controller('addfriendCtrl', ['$scope','$http', 'User',function($scope,$http,User) {  
   
   $scope.addfriend = function(){
   var nom = $scope.searchInfo;
       	$http.get('/api/utilisateur/'+nom)
    .success(function(data){   	
    //alert($scope.searchInfo);   

      var idAmi = data._id;
      var iduser = User.id;
   
     $http.post('/api/ami', {'idAmi1': iduser,
                              'idAmi2' : idAmi,
                              'accepte' : false })
          .success(function(friend) {
             console.log("Insertion ok")
          })               
               
   	}).error(function(data){
   		alert("erreur")
   	});
  $scope.searchInfo ="";

//alert(User.id); ok

   
}

}]);


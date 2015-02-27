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
   var name = $scope.searchInfo;
   	$http.get('/api/utilisateur/:'+name)
    .succes(function(data){   	
    //alert($scope.searchInfo);
    var idAmi = data.id;
    var iduser = User.id;
     $http.post('/api/ami', {'idAmi1': iduser,
                              'idAmi2' : idAmi,
                               'accepte' : false   })
          .success(function(friend) {
             //pas trop utile
          })
               
   	}).error(function(data){
   		alert("erreur")
   	});

//alert(User.id); ok

   
}

}]);


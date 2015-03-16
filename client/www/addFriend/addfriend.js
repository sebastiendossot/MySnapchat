'use strict';

angular.module('myApp.addfriend', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addfriend', {
    templateUrl: 'addFriend/addfriend.html',
    controller: 'addfriendCtrl',
    isPrivate: true
  });
}])

.controller('addfriendCtrl', ['$scope', 'socialWebService', 'userWebService', 'User', 
	function($scope, socialWebService, userWebService, User) {  

  $scope.addfriend = function() {
    var pseudo = $scope.searchInfo;

	/*
    var success = function(friend) {
      window.location.assign('#/friendlist')  
    }
    var error = function(data, status, headers){
      if(data.status === 404) {
        alert("Utilisateur inconnu");
      }
      console.error(data);
    }
	*/

	var error = function(data) {
		console.error("Une erreur s'est produite lors de l'ajout de l'utilisateur");
	}
	
	var successResearch = function(member) 
	{
		if(member.user!=null && member.user._id != User.id)
		{
			var successVerification = function(data) {
			
				if(!data.exist)
				{
					var successAdd = function(friend) {
						window.location.assign('#/friendlist')  
					}
					
					socialWebService.newFriend({'pseudo' : pseudo}, successAdd, error)
					$scope.searchInfo ="";
				}
				else
				{
					alert("Une demande d'ami est déjà en attente pour cet utilisateur.")
				}
			}
			
			socialWebService.alreadyInserted({data: member.user._id}, successVerification, error);
		}
		else
		{
			alert("L'utilsateur que vous essayez d'ajouter n'existe pas.")
		}
	}
	userWebService.byPseudo({data: pseudo}, successResearch, error);
	
		
	
	
	/*
	var populateUser = function(data) {
		alert(data.exist);
	}
	var error = function(data) {
		console.error("erreur lors de la récupération du nom de l'ami");
	}
	socialWebService.alreadyInserted({data: "507f191e810c19729de860ea"}, populateUser, error);
	*/
	
    /*Directly launch the new friendship to server. Server will return error 404 if the
    pseudo the user entered is invalid*/
    //socialWebService.newFriend({'pseudo' : pseudo}, success, error)

    //$scope.searchInfo ="";
  }

}]);


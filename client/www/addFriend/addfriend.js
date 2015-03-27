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
  }

}]);


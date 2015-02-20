'use strict';

angular.module('myApp.viewFriendList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/friendlist', {
		templateUrl: 'viewFriendList/friendlist.html',
		controller: 'friendListCtrl'
	});
}])

.controller('friendListCtrl', ['$scope', 'userWebService', 'User', '$location',
	function($scope, userWebService, User, $location)  {
		
		// Enlever le "|| true" quand le système  de connexion sera terminé !
		if(User.connected || true) 
		{
			$("#friendList").show();
		
			// REMPLACER PAR REQUETE PERMETTENT D'OBTENIR LA LISTE DES AMIS
			$scope.friendList = [
			  {nom:'John'},
			  {nom:'Jessie'},
			  {nom:'Johanna'},
			  {nom:'Roger'}
			]
			
			// REMPLACER PAR REQUETE PERMETTENT D'OBTENIR LA LISTE DES DEMANDES D'AMIS
			$scope.requestList = [
			  {nom:'Rihana'},
			  {nom:'Mickael'},
			  {nom:'Marc'},
			  {nom:'Simon'}
			]
			
			$scope.deleteFriend = function (friend) {
				$scope.friendList.splice($scope.friendList.indexOf(friend), 1);
				// AJOUTER ICI REQUETE POUR SUPPRIMER UN AMI
			}
			
			$scope.deleteRequest = function (friendRequest) {
				$scope.requestList.splice($scope.requestList.indexOf(friendRequest), 1);
				// AJOUTER ICI REQUETE POUR SUPPRIMER UNE DEMANDE D'AMIS
			}
		}
		else
		{
			$("#errorFriendList").show();
		}
	
	}]);
'use strict';

angular.module('myApp.viewFriendList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/friendlist', {
		templateUrl: 'viewFriendList/friendlist.html',
		controller: 'friendListCtrl'
	});
}])

.controller('friendListCtrl', ['$scope', '$http', 'userWebService', 'User', '$location',
	function($scope, $http, userWebService, User, $location)  {
		
		function getList(listName, $http, User)  {
			
			var tempfriendlist = [];
		
			User.id = "507f191e810c19729de860ea"; // A supprimer
			$http.get('/api/'+listName+'/'+User.id)
			.success(function(data) {
			   data.forEach(function(entry) {
					
					$http.get('/api/utilisateur/'+entry._id)
					.success(function(friend) {
					   tempfriendlist.push(friend);
					})
					.error(function(data) {
						alert("erreur lors de la récupération du nom d'un des amis");
					})
					
				});
			})
			.error(function(data) {
				alert("erreur lors de la récupération de la liste d'amis");
			})
			
			tempfriendlist = [
			  {nom:'John'},
			  {nom:'Jessie'},
			  {nom:'Johanna'},
			  {nom:'Roger'}
			]
			
			return tempfriendlist;
		}
		
		// Enlever le "|| true" quand le système  de connexion sera terminé !
		if(User.connected || true) 
		{
			$("#friendList").show();

			$scope.friendList = getList("friends", $http, User);
			$scope.requestList = getList("requests", $http, User);
			
			$scope.deleteFriend = function (friend) {
				$scope.friendList.splice($scope.friendList.indexOf(friend), 1);
				// AJOUTER ICI REQUETE POUR SUPPRIMER UN AMI
			}
			
			$scope.acceptRequest = function (friendRequest) {
				$scope.requestList.splice($scope.requestList.indexOf(friendRequest), 1);
				// AJOUTER ICI REQUETE POUR REFUSER DEMANDE D'AMIS
			}
			
			$scope.refuseRequest = function (friendRequest) {
				$scope.requestList.splice($scope.requestList.indexOf(friendRequest), 1);
				// AJOUTER ICI REQUETE POUR ACCEPTER DEMANDE D'AMIS
			}
		}
		else
		{
			$("#errorFriendList").show();
		}
	
	}]);
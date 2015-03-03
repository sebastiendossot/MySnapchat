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
					
					var friendId = entry.idAmi1;
					if(friendId == User.id)
						friendId = entry.idAmi2;
					
					$http.get('/api/utilisateur/'+friendId)
					.success(function(friend) {
					   tempfriendlist.push(friend);
					})
					.error(function(data) {
						console.log("erreur lors de la récupération du nom d'un des amis");
					})
					
				});
			})
			.error(function(data) {
				console.log("erreur lors de la récupération de la liste d'amis");
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
		$scope.userConnected = User.connected || true;
		
		if($scope.userConnected) 
		{
			$scope.friendList = getList("friends", $http, User);
			$scope.requestList = getList("requests", $http, User);
			
			$scope.deleteFriend = function (friend) {
				
				$http.post('/api/deleteRequest', {idToDelete:friend._id})
				.success(function() {
				   $scope.friendList = getList("friends", $http, User);
				})
				.error(function() {
					console.log("erreur lors de la suppression d'un des amis");
				})
				
			}
			
			$scope.acceptRequest = function (friendRequest) {
			
				$http.post('/api/acceptRequest', {idToUpdate:friendRequest._id})
				.success(function() {
					$scope.requestList = getList("requests", $http, User);
					$scope.friendList = getList("friends", $http, User);
				})
				.error(function() {
					console.log("erreur lors de l'acceptation d'un des amis");
				})
				
			}
		}
	
	}]);
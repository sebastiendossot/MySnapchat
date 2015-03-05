'use strict';

angular.module('myApp.viewFriendList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/friendlist', {
		templateUrl: 'viewFriendList/friendlist.html',
		controller: 'friendListCtrl',
		isPrivate: true
	});
}])

.controller('friendListCtrl', ['$scope', '$http', 'userWebService', 'User', '$location', 'socialWebService',
	function($scope, $http, userWebService, User, $location, socialWebService)  {
		$scope.friendList = [];
		$scope.receivedRequestList = []
		$scope.sentRequestList = []
		var error = function(data) {
			console.error("erreur lors de la récupération du nom d'un des amis");
		}

		var populateFriendList = function(data) {
			$scope.friendList = data.list;
		}
		var populateReceivedRequestList = function(data) {
			$scope.receivedRequestList = data.list;
		}
		var populateSentRequestList = function(data) {
			$scope.sentRequestList = data.list;
		}

		$scope.declineRequest = function (friend) {
			var success = function(data) {
				socialWebService.receivedRequests(null, populateReceivedRequestList, error);
				socialWebService.friends(null, populateFriendList, error);
			}
			var error = function(data) {
				console.error("erreur lors de la suppression d'un des amis");
			}
			socialWebService.declineRequest({data:friend.reqId}, success, error)

		}

		$scope.acceptRequest = function (friendRequest) {
			var success = function() {
				socialWebService.sentRequests(null, populateSentRequestList, error);
				socialWebService.friends(null, populateFriendList, error);
			}
			var error = function() {
				console.log("erreur lors de l'acceptation d'un des amis");
			}
			socialWebService.acceptRequest({data:friendRequest.reqId}, success, error);

		}

		// Enlever le "|| true" quand le système  de connexion sera terminé !
		$scope.userConnected = User.connected;
		
		if($scope.userConnected) 
		{
			socialWebService.friends(null, populateFriendList, error);
			socialWebService.receivedRequests(null, populateReceivedRequestList, error);
			socialWebService.sentRequests(null, populateSentRequestList, error);
		}

	}]);
'use strict';

angular.module('myApp.viewFriendList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/friendlist', {
		templateUrl: 'viewFriendList/friendlist.html',
		controller: 'friendListCtrl',
		isPrivate: true
	});
}])

.controller('friendListCtrl', ['$scope', 'userWebService', 'User', '$location', 'socialWebService', 'messageWebService',
	function($scope, userWebService, User, $location, socialWebService, messageWebService)  {
		$scope.friendList = [];
		$scope.receivedRequestList = []
		$scope.sentRequestList = []
		var error = function(data) {
			console.error("erreur lors de la récupération du nom d'un des amis");
		}

		var populateFriendList = function(data) {
			$scope.friendList = data.list;
			
			var successMsg = function(unreadMsg) {
				$scope.friendList.forEach(function(friend) {
					friend.user.numberUnreadMessages = 0
					unreadMsg.list.forEach(function(msg) {
						if(friend.user._id == msg.idEnvoyeur){
							friend.user.numberUnreadMessages ++
						}
					});
				});
			}
			var errorMsg = function(data) {
				console.error("erreur lors de la récupération du nombre de nouveau messages");
			}
			messageWebService.unreadMessages(null, successMsg, errorMsg)
			
			
		}
		var populateReceivedRequestList = function(data) {
			$scope.receivedRequestList = data.list;
		}
		var populateSentRequestList = function(data) {
			$scope.sentRequestList = data.list;
		}

		$scope.declineRequest = function (friendRequest) {
			var success = function(data) {
				socialWebService.receivedRequests(null, populateReceivedRequestList, error);
				socialWebService.friends(null, populateFriendList, error);
			}
			var error = function(data) {
				console.error("erreur lors du refus d'une demande d'ami");
			}
		
			socialWebService.declineRequest({data:friendRequest.reqId}, success, error)
		}

		$scope.acceptRequest = function (friendRequest) {
			var success = function() {
				socialWebService.receivedRequests(null, populateReceivedRequestList, error);
				socialWebService.sentRequests(null, populateSentRequestList, error);
				socialWebService.friends(null, populateFriendList, error);
			}
			var error = function() {
				console.log("erreur lors de l'acceptation d'un des amis");
			}
			socialWebService.acceptRequest({data:friendRequest.reqId}, success, error);

		}
		
		$scope.deleteFriend = function (friend) {
			var success = function(data) {
				socialWebService.receivedRequests(null, populateReceivedRequestList, error);
				socialWebService.friends(null, populateFriendList, error);
			}
			var error = function(data) {
				console.error("erreur lors de la suppression d'un des amis");
			}
			socialWebService.declineRequest({data:friend.friendshipId}, success, error)
		}
		
		$scope.userConnected = User.connected;
		if($scope.userConnected) 
		{
			socialWebService.friends(null, populateFriendList, error);
			socialWebService.receivedRequests(null, populateReceivedRequestList, error);
			socialWebService.sentRequests(null, populateSentRequestList, error);
		}

	}]);

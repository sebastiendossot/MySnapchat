'use strict';

angular.module('myApp.viewChat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/chat', {
		templateUrl: 'viewChat/chat.html',
		controller: 'affichageCtrl',
		isPrivate: true
	});
}])

.controller('affichageCtrl', ['$scope', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, messageWebService, User, Messaging, $location)  {
		
		var receivers = Messaging.receivers
		Messaging.resetReceivers()
		
		$scope.labelReceiver = receivers[0].pseudo
		
		var populateMessageList = function(data) {
			$scope.messageList = data.list;
		}	

		var error = function() {
			console.log("erreur lors de la recupération des messages");
		}
		messageWebService.receivedMessages(null, populateMessageList, error);
}])


.controller('imageCtrl', ['$scope', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, messageWebService, User, Messaging, $location)  {
		
}])

.controller('videoCtrl', ['$scope', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, messageWebService, User, Messaging, $location)  {
		
}]);

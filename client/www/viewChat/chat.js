'use strict';

angular.module('myApp.viewChat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/chat', {
		templateUrl: 'viewChat/chat.html',
		controller: 'affichageCtrl',
		isPrivate: true
	});
}])

.controller('affichageCtrl', ['$scope', '$http', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, $http, messageWebService, User, Messaging, $location)  {
		
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

.controller('messageCtrl', ['$scope', '$http', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, $http, messageWebService, User, Messaging, $location)  {
		
		$scope.sendMessage = function (message) {
			alert("Message à envoyer : " + message.text);
			
			var success = function(data) {
				alert("message ok !")
			}
			var error = function(data, status) {
				alert("Erreur envoi message")
			}
			
			var array_receivers = [];
			array_receivers.push({'idEnvoyeur':User.id, 'lu':false});
			messageWebService.newMessage({'type':"message", 'donnes':message.text, 'idEnvoyeur':User.id, 'destinataires':array_receivers}, success, error);
		}
		
}])

.controller('imageCtrl', ['$scope', '$http', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, $http, messageWebService, User, Messaging, $location)  {
		
}])

.controller('videoCtrl', ['$scope', '$http', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, $http, messageWebService, User, Messaging, $location)  {
		
}]);
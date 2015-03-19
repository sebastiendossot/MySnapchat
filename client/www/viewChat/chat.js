'use strict';

angular.module('myApp.viewChat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/chat/:mode/:idReceiver', {
		templateUrl: 'viewChat/chat.html',
		controller: 'affichageCtrl',
		isPrivate: true
	});
}])
.controller('affichageCtrl', ['$scope', '$routeParams', 'userWebService', 'messageWebService', 'User', '$location',
	function($scope, $routeParams, userWebService, messageWebService, User, $location)  {
		
		$scope.mode = $routeParams.mode;
		$scope.showPreview = false;
		$scope.messageList = []
		$scope.msgOpened = {}

		$scope.mobilePreview = function(bool){
			$scope.showPreview = bool;
		}

		//Identify the user we are talking to
		var whoIsIt = function() {
			var success = function(data) {
				$scope.pseudoReceiver = data.user.pseudo;
			}
			var error = function(data) {
				console.error("Erreur lors de la récupération du nom de l'ami");
			}
			userWebService.byId({data: $routeParams.idReceiver}, success, error);
		}
		whoIsIt();
		
		//Get and fill the messages
		$scope.getMessages = function() {
			var populateMessageList = function(data) {
				$scope.messageList = data.list;
				$scope.idUser = User.id;
			}
			var error = function() {
				console.error("Erreur lors de la recupération des messages");
			}
			messageWebService.get({data: $routeParams.idReceiver}, populateMessageList, error);	
		}
		$scope.getMessages();


		$scope.deleteMessage = function (message) {
			var success = function(data) {
				$('#mediaModal').modal('hide')
				$scope.getMessages();
			}
			var error = function(data) {
				console.error("erreur lors de la suppression du message : "+message._id);
			}
			messageWebService.deleteMessage({data:message._id}, success, error);
		}	

		$scope.messageCopy = function(message) {
			alert("Vous avez copié un message, votre ami a été prévenu");
			messageWebService.newMessage(
			{
				type: "text",
				donnes: "Votre ami a copié un de vos message",
				idEnvoyeur: User.id,
				destinataires: [{idDestinataire: $scope.receiver}]
			}, successWarn)
			$scope.deleteMessage(message);
		}

		$scope.getElapsedTime = function(message) {		
			var diff = new Date() - new Date(message.dateEnvoi);
			return Math.round(diff/60000);
		}

		//Function that 
		$scope.showMsg = function(bool, message) {
			//No need to spam the delete queue, just ask to delete te message only if it has not already been asked
			if(!$scope.msgOpened[message._id] && bool) {
				$scope.msgOpened[message._id] = true;
				$scope.deleteMessage(message);
			}
			message.show = bool;
			if(message.type == 'image'){
				$scope.mediaToShow = message.donnes
				$('#mediaModal').modal(bool ? 'show' : 'hide')
			}
		}

	}])

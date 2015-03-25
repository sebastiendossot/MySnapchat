'use strict';

angular.module('myApp.viewChat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/chat/:idReceiver', {
		templateUrl: 'viewChat/chat.html',
		controller: 'affichageCtrl',
		isPrivate: true
	});
}])
.controller('affichageCtrl', ['$scope', '$routeParams', 'userWebService', 'messageWebService', 'User', '$location',
	function($scope, $routeParams, userWebService, messageWebService, User, $location)  {

		$scope.mode = $routeParams.mode ? $routeParams.mode : "text";
		$scope.showPreview = false;
		$scope.messageList = []
		$scope.msgOpened = {}
		$scope.idReceiver = $routeParams.idReceiver;
	        $scope.userImgUrl = User.imgUrl

		$scope.mobilePreview = function(bool){
			$scope.showPreview = bool;
		}

		//Identify the user we are talking to
		var whoIsIt = function() {
			var success = function(data) {
				$scope.pseudoReceiver = data.user.pseudo
			        $scope.pictureReceiver = data.user.imgUrl
			}
			var error = function(data) {
				console.error("Erreur lors de la récupération du nom de l'ami");
			}
			userWebService.byId({data: $scope.idReceiver}, success, error);
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
			messageWebService.get({data: $scope.idReceiver}, populateMessageList, error);	
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
				destinataires: [{idDestinataire: $scope.idReceiver}]
			}, successWarn)
			$scope.deleteMessage(message);
		}

		$scope.getElapsedTime = function(message) {		
			var diff = new Date() - new Date(message.dateEnvoi);
			var tmp = Math.round(diff/60000);
			if(tmp > 1440){
				var rstH = tmp % 1440;
				var nDay = Math.floor(tmp/1440);
				var rstM = tmp % 60;
				var nHours = Math.floor(rstH/60);
				return nDay + " d " + nHours + " h " + rstM + " mins ago";
			}else if(tmp > 60){
				var rstM = tmp % 60;
				var nHours = Math.floor(tmp/60);
				return nHours + " h " + rstM + " mins ago";
			}else{
				return tmp + " mins ago";
			}
				
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

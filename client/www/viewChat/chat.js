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
		$scope.mobilePreview = function(bool){
			$scope.showPreview = bool;
		}
		
		$scope.isMobile = isMobile
		
		var populateUser = function(data) {
			$scope.pseudoReceiver = data.user.pseudo;
		}
		var error = function(data) {
			console.error("erreur lors de la récupération du nom de l'ami");
		}
		userWebService.byId({data: $routeParams.idReceiver}, populateUser, error);
		
		$scope.messageList = []

		var populateMessageList = function(data) {
			$scope.messageList = data.list;
			$scope.idUser = User.id;
		}	
		
		$scope.mouseOver = function(message){
			$scope.show = true;
			console.log(message.temps)	
			setTimeout(function(){
				console.log("fin")
				$scope.deleteMessage(message);
			}, 6000);
		}

		var error = function() {
			console.log("erreur lors de la recupération des messages");
		}

		$scope.deleteMessage = function (message) {
			var success = function(data) {
				messageWebService.receivedMessages(null, populateMessageList, error);
			}
			var error = function(data) {
				console.error("erreur lors de la suppression du message");
			}
			messageWebService.deleteMessage({data:message._id}, success, error);
		}		

		$scope.MessageCopy = function(message) {

			var successDelete = function(data){
				window.location.reload();
				alert("Vous avez copié un message, il a été supprimé et votre ami a été prévenu");
			}

			var successWarn = function(data){
				messageWebService.deleteMessage({data:message._id}, successDelete, error);
			}
			
			var error = function(data){
				$scope.error = true;
			}

			messageWebService.newMessage(
				{type: "text", donnes: "Votre ami a copié le message", 
				temps: User.time.texte,
				idEnvoyeur: User.id,
				destinataires: [{idDestinataire: $scope.receiver, lu: false}],
				dateEnvoi: new Date()}
				, successWarn, error)

		}

		$scope.getElapsedTime = function(message) {		
			var dateNow = new Date();
			var dateEnvoi = new Date(message.dateEnvoi);
			var diff = dateNow - dateEnvoi;
			return Math.round(diff/60000);
		}
		
		messageWebService.receivedMessages(null, populateMessageList, error);

	}])


.controller('videoCtrl', ['$scope', 'messageWebService', 'User', '$location',
	function($scope, messageWebService, User, $location)  {
		
	}]);

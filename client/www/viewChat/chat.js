'use strict';

angular.module('myApp.viewChat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/chat/:pseudoReceiver', {
		templateUrl: 'viewChat/chat.html',
		controller: 'affichageCtrl',
		isPrivate: true
	});
}])
.controller('affichageCtrl', ['$scope', '$routeParams', 'messageWebService', 'User', '$location',
	function($scope, $routeParams, messageWebService, User, $location)  {
		
		$scope.mode = "text";
		$("#photoView").hide();
		
		// ATTENTION : NOUVEAU SYSTEME DE DESTINATAIRE
		// LE PSEUDO DU DESTINATAIRE EST PASSE DANS L'URL
		$scope.receiver = $routeParams.pseudoReceiver;
		
		$scope.messageList = []
		
		$scope.dateNow = new Date();

		var populateMessageList = function(data) {
			$scope.messageList = data.list;
			$scope.idUser = User.id;
			$scope.show = false;
			$scope.first = true;
			//console.log($scope.messageList[0].pseudo);
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
		
		$scope.changeMode = function(newMode) 
		{
			$scope.mode = newMode;
		}
		

		/*var initDate = function(data) {
			var dateNow = new Date();
			var dateTmp = new Date(data);
			$scope.date = data;
		}*/
		
		messageWebService.receivedMessages(null, populateMessageList, error);

}
		
])


.controller('videoCtrl', ['$scope', 'messageWebService', 'User', '$location',
	function($scope, messageWebService, User, $location)  {
		
}]);

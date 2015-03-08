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
<<<<<<< HEAD
		var receivers = Messaging.receivers;
		$scope.messageList = []

		Messaging.resetReceivers();
		
=======
		
		var receivers = Messaging.receivers
	
>>>>>>> 52c1390747d92fcbe99becef23dd19bb0bb07c69
		$scope.labelReceiver = receivers[0].pseudo
		
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
				$scope.stop
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


		/*var initDate = function(data) {
			var dateNow = new Date();
			var dateTmp = new Date(data);
			$scope.date = data;
		}*/
		
		messageWebService.receivedMessages(null, populateMessageList, error);

}
		
])


.controller('imageCtrl', ['$scope', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, messageWebService, User, Messaging, $location)  {
		
}])

.controller('videoCtrl', ['$scope', 'messageWebService', 'User', 'Messaging', '$location',
	function($scope, messageWebService, User, Messaging, $location)  {
		
}]);

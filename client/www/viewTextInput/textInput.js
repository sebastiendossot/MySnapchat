'use strict';

angular.module('myApp.textInput', ['ngRoute'])

.controller('textInputCtrl', ['$scope', 'messageWebService', 'User', '$location', '$routeParams',
	function($scope, messageWebService, User, $location, $routeParams) {

		$scope.text=""
		$scope.error = false

		$scope.send = function() {

			var success = function(data){
				$scope.text=""
				window.location.reload()
		    	//messageWebService.receivedMessages(null, populateMessageList, error);
		    }
		    var error = function(data){
		    	$scope.error = true
		    }

		    messageWebService.newMessage(
		    {
		    	type: "text",
		    	donnes: $scope.text, 
		    	temps: User.time.texte,
		    	idEnvoyeur: User.id,
		    	destinataires: [ {idDestinataire: $routeParams.idReceiver, lu: false} ]
		    }
		    , success, error)

		}

	}])

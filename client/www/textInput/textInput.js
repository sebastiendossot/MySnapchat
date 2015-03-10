'use strict';

angular.module('myApp.textInput', ['ngRoute'])

.controller('textInputCtrl', ['$scope', 'messageWebService', 'User', 
	function($scope, messageWebService, User) {

	    $scope.text=""
	    $scope.error = false
		
		// ATTENTION : NOUVEAU SYSTEME DE DESTINATAIRE
		// LE PSEUDO DU DESTINATAIRE EST PASSE DANS L'URL
		// $scope.receivers = Messaging.receivers
		$scope.receivers = [];

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
		    {type: "text", donnes: $scope.text, 
		     temps: User.time.texte,
		     idEnvoyeur: User.id,
		     destinataires: $scope.receivers.map(function(receiver){
			 return {idDestinataire: receiver._id, lu: false}
		     }),
		     dateEnvoi: new Date()}
		    , success, error)
	    }
		
	}])

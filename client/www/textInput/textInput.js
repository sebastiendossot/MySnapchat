'use strict';

angular.module('myApp.textInput', ['ngRoute'])

.controller('textInputCtrl', ['$scope', 'messageWebService', 'User', '$location', 
	function($scope, messageWebService, User, $location) {

	    $scope.text=""
	    $scope.error = false
	    $scope.receiver = ($location.path().split('/')[3])

	    $scope.send = function() {

		var success = function(data){
		    $scope.text=""
		    window.location.reload()
		    //messageWebService.receivedMessages(null, populateMessageList, error);
		}
		var error = function(data){
		    $scope.error = true
		}

		var d = Date.parse(new Date());

		messageWebService.newMessage(
		    {type: "text", donnes: $scope.text, 
		     temps: User.time.texte,
		     idEnvoyeur: User.id,
		     destinataires: [{idDestinataire: $scope.receiver, lu: false}],
		     dateEnvoi: d}
		    , success, error)

	    }
		
	}])

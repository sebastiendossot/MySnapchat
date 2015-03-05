'use strict';

angular.module('myApp.textInput', ['ngRoute'])

.controller('textInputCtrl', ['$scope', '$http', 'User', 
	function($scope, $http, User) {

	    $scope.text=""
	    $scope.error = false

	    $scope.send = function() {
		$http.post('/api/message', {
		    type: "text", donnes: $scope.text, temps: 60,
		    idEnvoyeur: User.id,
		    destinataires:[{idDestinataire:"", lu: false}],
		    dateEnvoi: new Date()
		})
		.success(function(data){
		    $scope.text=""
		    windows.location.assign("#/chat")
		})
		.error(function(data){
		    $scope.error = true
		})
	    }

	}])

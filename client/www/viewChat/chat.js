'use strict';

angular.module('myApp.viewChat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/chat', {
		templateUrl: 'viewChat/chat.html',
		controller: 'chatCtrl'
	});
}])

.controller('chatCtrl', ['$scope', '$http', 'userWebService', 'User', '$location',
	function($scope, $http, userWebService, User, $location)  {
		
		var tempMessageList = [
		  {sender:"David Cheminade", receiver:0, text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor eu fugiat nulla pariatur.'},
		  {sender:"Roger Rabbit", receiver:1, text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor eu fugiat nulla pariatur.'},
		  {sender:"Roger Rabbit", receiver:1, text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor eu fugiat nulla pariatur.'},
		  {sender:"David Cheminade", receiver:0, text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor eu fugiat nulla pariatur.'},
		  {sender:"Roger Rabbit", receiver:1, text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor eu fugiat nulla pariatur.'},
		]
		
		$scope.messageList = tempMessageList;
	
		$scope.sendMessage = function (message) {
			alert("Message à envoyer : " + message.text);
		}
	
	}]);
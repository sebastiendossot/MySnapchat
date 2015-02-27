'use strict';

var onDeviceReady = function() {
	angular.module('myApp', [
		'ngRoute',
		'myApp.viewConnection',
		'myApp.viewNavBar',		
		'myApp.register',  
		'myApp.settings',
		'myApp.addfriend',
		'myApp.viewFriendList',
		'myApp.viewChat',
		'myApp.api',
		'myApp.webService',
		])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/connection'});
	}]);
	
	// Manually launch bootstrap
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['myApp']);
	});
}


if ( app ) {
    // Cordova application
    document.addEventListener('deviceready', onDeviceReady(), false);
} else {
    // Web page
    onDeviceReady();
}  

'use strict';

var onDeviceReady = function() {
	angular.module('myApp', [
		'ngRoute',
		'myApp.viewConnection',
<<<<<<< HEAD
		'myApp.viewNavBar',		
		'myApp.view1',
		'myApp.register',
		'myApp.version'
=======
		'myApp.viewNavBar',
		'myApp.settings',
		'myApp.api',
		'myApp.webService',
>>>>>>> 012afdce4ad5bde81d77ea2c770b684fb07d29ab
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

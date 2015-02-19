'use strict';

var onDeviceReady = function() {
	angular.module('myApp', [
		'ngRoute',
		'myApp.viewConnection',
		'myApp.viewNavBar',
		'myApp.view1',
		'myApp.view2',
		'myApp.version'
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

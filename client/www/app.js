'use strict';

var onDeviceReady = function() {
	angular.module('myApp', [
		'ngRoute',
		'ngStorage',
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

	.factory('sessionInjector', ['$localStorage', function($localStorage) {  
		var sessionInjector = {
			request: function(config) {
				if ($localStorage.token) {
					config.headers['x-session-token'] = $localStorage.token;
				}
				return config;
			}
		};
		return sessionInjector;
	}])
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
		$routeProvider.otherwise({redirectTo: '/connection'});
		$httpProvider.interceptors.push('sessionInjector');
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

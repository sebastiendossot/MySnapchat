'use strict';

var onDeviceReady = function() {
	angular.module('myApp', [
		'ngRoute',
		'ngStorage',
		'webcam',
		'myApp.api',
		'myApp.webService',
		'myApp.viewConnection',
		'myApp.viewNavBar',		
		'myApp.register',  
		'myApp.settings',
		'myApp.addfriend',
		'myApp.viewFriendList',
		'myApp.viewChat',       
		'myApp.textInput',
		'myApp.textOutput',
		'myApp.imageInput',
		'myApp.imageOutput',
		'myApp.viewTime',
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
		$routeProvider.otherwise({redirectTo: '/login'});
		$httpProvider.interceptors.push('sessionInjector');
	}]).run(function($rootScope, $location, User) {
		$rootScope.mainPageUrl = "friendlist";
		$rootScope.isMobile = isMobile;
		$rootScope.$on("$locationChangeStart", function(event, next, current){
			var getHash = function(path){
				var idx = path.indexOf('#');
				return path.substr(idx + 1);
			}
			var hash = getHash(next);
			// If already logged and wants to go to login page, redirect to main page
			if ((hash === "/login" || hash === "/register")  && User.connected) {
				event.preventDefault();
				console.log("Already logged, redirecting to main page")
				$location.url($rootScope.mainPageUrl)
			}
		});
		$rootScope.$on("$routeChangeStart",function(event, next, current){
			if(next.isPrivate && !User.connected) {
				event.preventDefault();
				console.log("You need to login to access this page")
				$location.url("/login")
			}
		})
	});
	
	// Manually launch bootstrap
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['myApp']);
	});
}


if ( isMobile ) {
    // Cordova application
    document.addEventListener('deviceready', onDeviceReady(), false);
} else {
    // Web page
    onDeviceReady();
}  

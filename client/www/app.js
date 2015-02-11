'use strict';

// Declare app level module which depends on views, and components
document.addEventListener('deviceready', function onDeviceReady() {
	angular.bootstrap(document, ['myApp']);
}, false);

angular.module('myApp', [
	'ngRoute',
	'myApp.view1',
	'myApp.view2',
	'myApp.version'
	]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/view1'});
}]);


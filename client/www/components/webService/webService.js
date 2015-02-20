angular.module('myApp.webService', ['ngResource'])

.factory('userWebService',
	function($resource) {
		return $resource('/url/user/:urlOption', null, {
			login:{method:'POST', urlOption:'login'},
			logout:{method:'POST', urlOption:'logout'}
		});
	});

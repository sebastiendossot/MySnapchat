angular.module('myApp.webService', ['ngResource'])

.factory('userWebService',
	function($resource) {
		return $resource('./../api/utilisateur/:urlOption', null, {
			login:{method:'POST', params:{urlOption:"login"}},
			logout:{method:'POST', params:{urlOption:"logout"}}
		});
	});

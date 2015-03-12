var SERVER_URL = isMobile ? "http://test2-44045.onmodulus.net/api" : "/api";
angular.module('myApp.webService', ['ngResource'])

.factory('userWebService',
	function($resource) {
		return $resource(SERVER_URL+'/user/:urlOption/:data', {data:'@data'}, {
			subscribe: {method: 'POST', params: {urlOption: "subscribe"}},
			login: {method: 'POST', params: {urlOption: "login"}},
			byPseudo: {method: 'GET', params: {urlOption: "byPseudo"}},
			byId: {method: 'GET', params: {urlOption: "byId"}},
			unsubscribe: {method: 'DELETE', params: {urlOption: 'unsubscribe'}},
			putTimes: {method: 'PUT', params: {urlOption: "times"}}
		})
	})
.factory('socialWebService',
	function($resource) {
		return $resource(SERVER_URL+'/:urlOption/:data', {data:'@data'}, {
			receivedRequests: {method: 'GET', params: {urlOption: "receivedRequests"}},
			sentRequests: {method: 'GET', params: {urlOption: "sentRequests"}},
			friends: {method: 'GET', params: {urlOption: "friends"}},
			newFriend: {method: 'POST', params: {urlOption: "friend"}},
			declineRequest: {method: 'DELETE', params: {urlOption: "friend"}},
			acceptRequest: {method: 'PUT', params: {urlOption: "request"}}
		})
	})
.factory('messageWebService',
	function($resource) {
		return $resource('/api/message/:data', {data:'@data'}, {
			newMessage: {method: 'POST'},
			receivedMessages: {method: 'GET'},
			deleteMessage:{method: 'DELETE'}
		})
	})


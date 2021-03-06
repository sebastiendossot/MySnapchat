var SERVER_URL = isMobile ? "http://test2-44045.onmodulus.net/api" : "/api";
angular.module('myApp.webService', ['ngResource', 'angularFileUpload'])

.factory('userWebService',
	function($resource) {
		return $resource(SERVER_URL+'/user/:urlOption/:data', {data:'@data'}, {
			subscribe: {method: 'POST', params: {urlOption: "subscribe"}},
			login: {method: 'POST', params: {urlOption: "login"}},
			byPseudo: {method: 'GET', params: {urlOption: "byPseudo"}},
			byId: {method: 'GET', params: {urlOption: "byId"}},
			unsubscribe: {method: 'DELETE', params: {urlOption: 'unsubscribe'}},
			putTimes: {method: 'PUT', params: {urlOption: "times"}},
			putDescription: {method: 'PUT', params: {urlOption: "description"}},
			putPassword: {method: 'PUT', params: {urlOption: "password"}},
			putProfileImg: {method: 'PUT', params: {urlOption: "picture"}}
		})
	})

.factory('socialWebService',
	function($resource) {
		return $resource(SERVER_URL+'/:urlOption/:data', {data:'@data'}, {
			receivedRequests: {method: 'GET', params: {urlOption: "receivedRequests"}},
			sentRequests: {method: 'GET', params: {urlOption: "sentRequests"}},
			friends: {method: 'GET', params: {urlOption: "friends"}},
			alreadyInserted: {method: 'GET', params: {urlOption: "alreadyInserted"}},
			newFriend: {method: 'POST', params: {urlOption: "friend"}},
			declineRequest: {method: 'DELETE', params: {urlOption: "friend"}},
			acceptRequest: {method: 'PUT', params: {urlOption: "request"}}
			
		})
	})

.factory('messageWebService',
	function($resource) {
		return $resource(SERVER_URL+'/:urlOption/:data', {data:'@data'}, {
			get: {method: 'GET', params: {urlOption: "message"}},
			unreadMessages: {method: 'GET', params: {urlOption: "unreadMessages"}},
			newMessage: {method: 'POST', params: {urlOption: "message"}},
			deleteMessage:{method: 'DELETE', params: {urlOption: "message"}}
		})
	})
.factory('msgVideoWebService',
	function($upload) {
		return {
			post : function(datas, success, error, progress) {
				$upload.upload({
					url: SERVER_URL+'/message',
					file: datas.file,
					fields: datas.fields
				}).progress(progress).error(error).success(success)
			}
		}
	})


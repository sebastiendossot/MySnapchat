angular.module('myApp.api', ['ngStorage'])

.service('User', function($localStorage) {
	
	this.connected = undefined !== $localStorage.token
	this.id = $localStorage.user ? $localStorage.user._id : ""
	this.name = $localStorage.user ? $localStorage.user.pseudo : ""
	this.mail = $localStorage.user ? $localStorage.user.email : ""
	this.description = $localStorage.user ? $localStorage.user.description : ""
	this.time = $localStorage.user ? $localStorage.user.temps : ""
	this.imgUrl = $localStorage.user ? $localStorage.user.imgUrl : null

	this.login = function(data) {
		$localStorage.token = data.token
		$localStorage.user = data.user

		this.connected = true
		this.id = data.user._id
		this.name = data.user.pseudo
		this.mail = data.user.email
		this.description = data.user.description
		this.time = data.user.temps
		this.imgUrl = data.user.imgUrl;
	}

	this.update = function(key, value) {
		this[key] = value;
		$localStorage.user[key] = value;
	}

	this.logout = function() {
		delete $localStorage.token;
		delete $localStorage.user;
		
		this.connected = false
		this.id = ""
		this.name = ""
		this.mail = ""
		this.description = ""
		this.time = ""
		this.imgUrl = null;
	}

})

.factory('CameraService', function($window) {
	var hasUserMedia = function() {
		return !!getUserMedia();
	}

	var getUserMedia = function() {
		navigator.getUserMedia = ($window.navigator.getUserMedia || 
			$window.navigator.webkitGetUserMedia ||
			$window.navigator.mozGetUserMedia || 
			$window.navigator.msGetUserMedia);
		return navigator.getUserMedia;
	}
	return {
		hasUserMedia: hasUserMedia()
	}
});

/*
.service('Messaging', function($localStorage) {
	
	this.receivers = []
	
	this.addReceiver = function(user) {
		this.receivers.push(user)
	}
	
	this.resetReceivers = function() {
		this.receivers = []
	}
});
*/

angular.module('myApp.api', ['ngStorage'])

.service('User', function($localStorage) {
	
	this.connected = undefined !== $localStorage.token
	this.id = $localStorage.user ? $localStorage.user._id : ""
	this.name = $localStorage.user ? $localStorage.user.pseudo : ""
	this.mail = $localStorage.user ? $localStorage.user.email : ""
	this.description = $localStorage.user ? $localStorage.user.description : ""

	this.login = function(data) {
		$localStorage.token = data.token
		$localStorage.user = data.user

		this.connected = true
		this.id = data.user._id
		this.name = data.user.pseudo
		this.mail = data.user.email
		this.description = data.user.description
	}

	this.logout = function() {
		delete $localStorage.token;
		delete $localStorage.user;
		
		this.connected = false
		this.id = ""
		this.name = ""
		this.mail = ""
		this.description = ""
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

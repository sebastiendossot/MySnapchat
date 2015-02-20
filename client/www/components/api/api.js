angular.module('myApp.api', [])

.factory('User', function() {
	return {

		connected : false,
		id : "",
		name : "",
		mail : "",
		description : "",

		login : function(doc) {
			connected = true
			id = doc.id
			name = doc.nom
			mail = doc.mail
			description = doc.description
		},

		logout : function() {
			connected : false
			id : ""
			name : ""
			mail : ""
			description : ""
		}

	}
})
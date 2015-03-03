angular.module('myApp.api', []).service('User', function() {
    
    this.connected = false
    this.id = ""
    this.name = ""
    this.mail = ""
    this.description = ""

    this.login = function(doc) {
			this.connected = true
			this.id = doc._id
			this.name = doc.nom
			this.mail = doc.mail
			this.description = doc.description
		}

    this.logout = function() {
			this.connected = false
			this.id = ""
			this.name = ""
			this.mail = ""
			this.description = ""
		}

	})

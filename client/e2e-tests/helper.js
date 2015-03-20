module.exports = {
	login: function (user, pwd) {
		element(by.model('pseudo')).sendKeys(user)
		element(by.model('password')).sendKeys(pwd)
		element(by.buttonText('Connexion')).click()
	},
	login: function (user) {
		element(by.model('pseudo')).sendKeys(user)
		element(by.model('password')).sendKeys(user)
		element(by.buttonText('Connexion')).click()
	},
	subscribe: function(user) {
		element(by.model('email')).sendKeys(user+'@gmail.com');
		element(by.model('pseudo')).sendKeys(user);
		element(by.model('pwd')).sendKeys(user);
		element(by.model('pwd1')).sendKeys(user);
		element(by.buttonText("S'enregistrer")).click();
	},
	logout: function (user) {
		element(by.linkText(user)).click()
		element(by.linkText('Deconnexion')).click()
	},
	sendRequest: function(friend) {
		element(by.linkText('Ajouter un ami')).click()
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/addfriend')
		element(by.model('searchInfo')).sendKeys(friend)
		element(by.buttonText('Ajouter')).click()
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')

		expect(element.all(by.repeater('request in sentRequestList')).get(0).getText()).toMatch('user2')
	},

    unsubscribe: function() {
	element(by.linkText('Paramètres')).click()
	element(by.linkText('Supprimer mon compte')).click()
	element(by.buttonText('Oui')).click()
	browser.wait( function() {
	    return element(by.buttonText('Okay')).isDisplayed()
	});
	element(by.buttonText('Okay')).click()
	browser.wait( function() {
	    return browser.getCurrentUrl().then(function (newUrl) {
		return (newUrl !== 'http://localhost:4711/#/settings')
	    })
	})
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
    }

}

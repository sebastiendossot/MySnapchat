describe('register/login', function () {

    beforeEach(function() {
	browser.get('http://localhost:4711/#/login')
    })

    function connection() {
	element(by.model('pseudo')).sendKeys('user1')
	element(by.model('password')).sendKeys('user1')
	element(by.buttonText('Connection')).click()
    }

    it('should register and connect an user', function() {
	//TODO
    })

    it('should logout this user', function() {
	//TODO
    })

    it('should unregister this user', function() {
	connection()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')

	element(by.linkText('Paramètres')).click()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/settings')

	element(by.linkText('Supprimer mon compte')).click()
	element(by.buttonText('Oui')).click()
	element(by.buttonText('Okay')).click()
	browser.wait( function() {
	    return browser.getCurrentUrl().then(function (newUrl) {
		return (newUrl !== 'http://localhost:4711/#/settings');
	    })
	})
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	
	connection()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
    })

})

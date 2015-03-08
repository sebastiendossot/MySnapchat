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
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/register')
		element(by.model('email')).sendKeys('user1@gmail.com');
		element(by.model('pseudo')).sendKeys('user1');
		element(by.model('pwd')).sendKeys('user1');
		element(by.model('pwd1')).sendKeys('user1');
		element(by.buttonText("S'enregistrer")).click();
    })

    it('should logout this user', function() {
	connection()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')

	element(by.linkText('user1')).click()
	element(by.linkText('Deconnexion')).click()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
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

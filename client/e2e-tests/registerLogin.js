describe('register/login', function () {

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
	expect(browser.getCurrentUrl()).toContain('#/friendlist')

	element(by.linkText('Paramètres')).click()
	expect(browser.getCurrentUrl()).toContain('#/settings')

	element(by.linkText('Supprimer mon compte')).click()
	element(by.buttonText('Oui')).click()
	element(by.buttonText('Okay')).click()
	expect(browser.getCurrentUrl()).toContain('#/login')

	connection()
	expect(browser.getCurrentUrl()).toContain('#/login')
    })

})

var helper = require("./helper")
describe('register/login', function () {

	beforeEach(function() {
		browser.get('http://localhost:4711/#/login')
	})

	it('should register and connect an user', function() {
		//TODO
		browser.get('http://localhost:4711/#/register')
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/register')
		helper.subscribe("user1")
		browser.wait( function() {
			return browser.getCurrentUrl().then(function (newUrl) {
				return (newUrl !== 'http://localhost:4711/#/register');
			})
		})
		helper.login("user1")
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')
	})

	it('should logout this user', function() {
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')
		helper.logout("user1")
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

	it('should unregister this user', function() {
		helper.login("user1");
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')

		element(by.linkText('Paramètres')).click()
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/settings')

		element(by.linkText('Supprimer mon compte')).click()
		element(by.buttonText('Oui')).click()
		browser.wait( function() {
			return element(by.buttonText('Okay')).isDisplayed()
		});
		element(by.buttonText('Okay')).click()
		browser.wait( function() {
			return browser.getCurrentUrl().then(function (newUrl) {
				return (newUrl !== 'http://localhost:4711/#/settings');
			})
		})
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')

		helper.login("user1");
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

})

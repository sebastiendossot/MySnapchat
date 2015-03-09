var helper = require("./helper")
describe('add/delete', function () {

	beforeEach(function() {
		browser.get('http://localhost:4711/#/login')
	})

	it('should register user1 & user2', function() {
		var sub = function(user) {
			browser.get('http://localhost:4711/#/register')
			expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/register')
			helper.subscribe(user)
			browser.wait( function() {
				return browser.getCurrentUrl().then(function (newUrl) {
					return (newUrl !== 'http://localhost:4711/#/register');
				})
			})
			expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
		}
		sub('user1');
		sub('user2');
	})

	it('user1 should add user2 as a friend', function() {
		helper.login('user1')
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')

		helper.sendRequest('user2')
		helper.logout('user1')
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

	it('user2 should refuse user1 as a friend', function() {
		helper.login('user2')
		var row = element.all(by.repeater('request in receivedRequestList')).get(0)

		expect(row.getText()).toContain('user1')
		row.element(by.partialLinkText('Refuser')).click()
		expect(element.all(by.repeater('friend in friendList')).count()).toBe(0)
		helper.logout('user2')
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

	it('user2 should accept user1 as a friend', function() {
		//renvoi demande d'ami
		helper.login('user1')
		helper.sendRequest('user2')
		helper.logout('user1')

		helper.login('user2')
		var row = element.all(by.repeater('request in receivedRequestList')).get(0)
		expect(row.getText()).toContain('user1')

		row.element(by.partialLinkText('Accepter')).click()
		expect(element.all(by.repeater('friend in friendList')).get(0).getText()).toContain('user1')
		helper.logout('user2')
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

	it('user1 delete user2 from his friends', function() {
		helper.login('user1')
		var row = element.all(by.repeater('friend in friendList')).get(0)
		expect(row.getText()).toContain('user2')

		row.element(by.css('.btn.btn-xs.btn-danger')).click()
		expect(element.all(by.repeater('friend in friendList')).count()).toBe(0)
		helper.logout('user1')
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

	it('should end the test by unregistering user1 & user2', function() {
		var unsub = function(user) {
			helper.login(user);

			element(by.linkText('Paramètres')).click()

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
		}
		unsub('user1');
		unsub('user2');

	})

})

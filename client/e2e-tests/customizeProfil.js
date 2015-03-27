var helper = require("./helper")
describe('customize profil', function () {

	beforeEach(function() {
		browser.get('http://localhost:4711/#/login')
	})

	it('should register user1', function() {
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
	})

	

it("user1 should add a description", function(){
		helper.login('user1');
		element(by.css('[href="#/settings"]')).click();
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/settings')
		element(by.model('newDescription')).sendKeys("je suis user1 voici ma description!");
		element(by.id('saveDescription')).click();
		expect(element(by.id('userDescription')).getAttribute('textContent')).toBe("je suis user1 voici ma description!");
		helper.logout('user1');
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

/*it("user1 should add a picture to his profile", function(){
		helper.login('user1');
		element(by.css('[href="#/settings"]')).click();
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/settings')
		//Non terminé
		helper.logout('user1');
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})
*/

	it('should end the test by unregistering user1', function() {
		var unsub = function(user) {
		    helper.login(user);
		    helper.unsubscribe()
		}
		unsub('user1');

	})
})

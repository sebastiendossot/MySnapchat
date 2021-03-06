var helper = require("./helper")
describe('send and receive text', function () {

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

	it('user2 should accept user1 as a friend', function() {
		helper.login('user1')
		helper.sendRequest('user2')
		helper.logout('user1')

		helper.login('user2')
		var row = element.all(by.repeater('request in receivedRequestList')).get(0)
		expect(row.getText()).toContain('user1')

		row.element(by.partialLinkText('Accepter')).click()
		expect(element.all(by.repeater('friend in friendList')).get(0).getText()).toContain('user1')
	})

	it("user2 should send some text to his new friend user1", function(){
		element(by.id('text-user1')).click();
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/chat')
		element(by.model('text')).sendKeys("Hi Bob !");
		element(by.css('[ng-click="send()"]')).click()
		helper.logout('user2');
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})


it("user1 should send some text to his new friend user1", function(){

		helper.login('user1')		
		element(by.id('text-user2')).click();
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/chat')
		element(by.model('text')).sendKeys("je suis user1 j'envoie un message a user2!");
		element(by.css('[class="btn-group pull-right"]')).click();
		element(by.id('text')).getText().clear().sendKeys("3");
		element(by.css('[class="btn btn-primary"]')).click();
		element(by.css('[ng-click="send()"]')).click()
		helper.logout('user1');
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})


	it("user1 should login and see a new message from user2 !", function(){
		helper.login('user2')
		element(by.id('text-user1')).click();
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/chat')
		expect(element(by.css('[ng-show="message.show"]')).getAttribute('textContent')).toBe("je suis user1 j'envoie un message a user2!");
		browser.actions().mouseDown(element(by.id('msg'))).perform();
		waits(3000);
		browser.actions().mouseUp().perform();
		expect(element(by.id('msg')).isPresent()).toBe(false);
		//expect(element(by.id('msg')).isPresent().toBe(false));
		helper.logout('user2');
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})

	it('should end the test by unregistering user1 & user2', function() {
		var unsub = function(user) {
		    helper.login(user);
		    helper.unsubscribe()
		}
		unsub('user1');
		unsub('user2');

	})
})

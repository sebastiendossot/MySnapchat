var helper = require("./helper")
describe('send and receive text', function () {

	beforeEach(function() {
		browser.get('http://localhost:4711/#/login')
	})
	it('should register user1 & user2', function() {
		var sub = function(user) {
			xpect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
		}
		sub('user1');		
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
		element(by.model('text')).sendKeys(" Test avec de Test pour l'envoie d'un text  !");
		element(by.css('[ng-click="send()"]')).click()
		helper.logout('user2');
		expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	})	
	
})
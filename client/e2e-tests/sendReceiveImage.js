var helper = require("./helper")

describe('send and receive image', function () {

    beforeEach(function() {
	browser.get('http://localhost:4711/#/login')
    })

    it('user1 and user2 should be registered', function() {
	var sub = function(user) {
	    browser.get('http://localhost:4711/#/register')
	    expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/register')
	    helper.subscribe(user)
	    browser.wait( function() {
		return browser.getCurrentUrl().then(function (newUrl) {
		    return (newUrl !== 'http://localhost:4711/#/register')
		})
	    })
	    expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
	}
	sub('user1')
	sub('user2')
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
	helper.logout('user2')
	})

    it('user2 should take and send a photo to user1', function() {
	helper.login('user2')
	element(by.id('image-user1')).click();
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/chat')
	element(by.css('.btn.btn-lg.btn-primary')).click()
	waits(3000)

	element(by.partialButtonText('Prendre une photo')).click()
	element(by.partialButtonText('Envoyer')).click()
	expect(element(by.id("imgSent")).isPresent()).toBe(true)
	helper.logout('user2')
    })

    it('user1 should receive an image from user2', function() {
	helper.login('user1')
	element(by.id('image-user2')).click()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/chat')
	
	waits(3000)
	expect(element(by.id("imgReceived")).isPresent()).toBe(true)
	helper.logout('user1')
    })

    it('should end the test by unregistering user1 & user2', function() {
	var unsub = function(user) {
	    helper.login(user)
	    helper.unsubscribe()
	}
	unsub('user1')
	unsub('user2')

    })


})

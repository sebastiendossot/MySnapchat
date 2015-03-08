describe('add/delete', function () {

    beforeEach(function() {
	browser.get('http://localhost:4711/#/login')
    })

    function login(user) {
	element(by.model('pseudo')).sendKeys(user)
	element(by.model('password')).sendKeys(user)
	element(by.buttonText('Connection')).click()
    }

    function sendRequest(friend) {
	element(by.linkText('Ajouter un ami')).click()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/addfriend')
	element(by.model('searchInfo')).sendKeys(friend)
	element(by.buttonText('Ajouter')).click()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')

	expect(element.all(by.repeater('request in sentRequestList')).get(0).getText()).toMatch('user2')
    }

    function logout(user) {
	element(by.linkText(user)).click()
	element(by.linkText('Deconnexion')).click()
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/login')
}

    it('user1 shoud add user2 as a friend', function() {
	login('user1')
	expect(browser.getCurrentUrl()).toMatch('http://localhost:4711/#/friendlist')

	sendRequest('user2')
	logout('user1')
    })

    it('user2 shoud refuse user1 as a friend', function() {
	login('user2')
	var row = element.all(by.repeater('request in receivedRequestList')).get(0)

	expect(row.getText()).toContain('user1')
	row.element(by.partialLinkText('Refuser')).click()
	expect(element.all(by.repeater('friend in friendList')).count()).toBe(0)
	logout('user2')
    })

    it('user2 shoud accept user1 as a friend', function() {
	//renvoi demande d'ami
	login('user1')
	sendRequest('user2')
	logout('user1')

	login('user2')
	var row = element.all(by.repeater('request in receivedRequestList')).get(0)
	expect(row.getText()).toContain('user1')

	row.element(by.partialLinkText('Accepter')).click()
	expect(element.all(by.repeater('friend in friendList')).get(0).getText()).toContain('user1')
	logout('user2')
    })

    it('user1 delete user2 from his friends', function() {
	login('user1')
	var row = element.all(by.repeater('friend in friendList')).get(0)
	expect(row.getText()).toContain('user2')
	
	row.element(by.css('.btn.btn-xs.btn-danger')).click()
	expect(element.all(by.repeater('friend in friendList')).count()).toBe(0)
	logout('user1')
    })


})

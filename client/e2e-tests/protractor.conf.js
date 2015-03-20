exports.config = {
  allScriptsTimeout: 20000,

  specs: [ 
    'sendReceiveImage.js'
  ],

  capabilities: {
      'browserName': 'chrome',
      'chromeOptions': {
	  args: ['--use-fake-ui-for-media-stream'],
	  prefs: {
              'VideoCaptureAllowedUrls': ['http://localhost:4711']  
	  }
      }
  },

  //baseUrl: 'http://localhost:4711',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 20000
  }
};

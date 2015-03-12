exports.config = {
  allScriptsTimeout: 10000,

  specs: [  
  'chatting.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  //baseUrl: 'http://localhost:4711',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 10000
  }
};
exports.config = {
  allScriptsTimeout: 30000,

  specs: [
  'chatting.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  //baseUrl: 'http://localhost:4711',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
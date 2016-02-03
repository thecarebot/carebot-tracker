/*jslint node: true */
/*globals describe, it */
'use strict';

var nightwatch = require('nightwatch');

describe('Github', function() {
  var client = nightwatch.initClient({
    silent : true
  });

  var browser = client.api();

  this.timeout(99999999);

  before(function() {

    browser.perform(function() {
      console.log('beforeAll')
    });

  });

  beforeEach(function(done) {
    browser.perform(function() {
      console.log('beforeEach')
    });

    client.start(done);
  });


  it('Demo test GitHub', function (done) {
    browser
      .url('https://github.com/nightwatchjs/nightwatch')
      .waitForElementVisible('body', 5000)
      .assert.title('nightwatchjs/nightwatch · GitHub')
      .waitForElementVisible('body', 1000)
      .assert.visible('.container .breadcrumb a span')
      .assert.containsText('.container .breadcrumb a span', 'nightwatch', 'Checking project title is set to nightwatch');

    client.start(done);
  });

  afterEach(function() {
    browser.perform(function() {
      console.log('afterEach')
    });
  });

  after(function(done) {
    browser.end(function() {
      console.log('afterAll')
    });

    client.start(done);
  });

});

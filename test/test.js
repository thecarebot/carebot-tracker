/*jslint node: true */
/*globals describe, it */
'use strict';

var mocha = require('mocha');
var should = require('should');
var CarebotTracker = require('../src/carebot-tracker');

describe('Timer', function () {
  describe('startTimer', function() {

    // Wait up to 15 seconds:
    this.timeout(15000);

    function checkTimer(msWait, done) {
      var timer = new CarebotTracker.Timer();
      timer.start();

      setTimeout(function() {
        timer.pause();
        done(timer);
      }, msWait);
    }

    it('should handle very short times', function(done) {
      var timer = new CarebotTracker.Timer();
      timer.start();

      checkTimer(100, function(timer) {
        timer.check().seconds.should.equal(0);
        timer.check().bucket.should.equal('0s');
        done();
      });
    });

    it('should record 1 second', function(done) {
      checkTimer(1000, function(timer) {
        timer.check().seconds.should.equal(1);
        timer.check().bucket.should.equal('0s');
        done();
      });
    });

    it('should record 10 seconds', function(done) {
      checkTimer(10000, function(timer) {
        timer.check().seconds.should.equal(10);
        timer.check().bucket.should.equal('10s');
        done();
      });
    });
  });
});

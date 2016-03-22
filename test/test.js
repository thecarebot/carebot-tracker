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
      var timer = new CarebotTracker.Timer(function () {
        // noop
      });
      timer.start();

      setTimeout(function() {
        timer.pause();
        done(timer);
      }, msWait);
    }

    it('should handle very short times', function(done) {
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

    it('should be able to pause and resume', function(done) {
      checkTimer(1000, function(timer) {
        timer.check().seconds.should.equal(1);

        // Restart and wait another 9 seconds
        timer.start();
        setTimeout(function() {
          timer.pause();
          timer.check().seconds.should.equal(10);
          timer.check().bucket.should.equal('10s');
          done();
        }, 9000);
      });
    });

    it('alert on time buckets', function(done) {
      var timer = new CarebotTracker.Timer(function(results) {
        results.bucket.should.equal('0s');
        done();
      });
      timer.start();
    });
  });
});

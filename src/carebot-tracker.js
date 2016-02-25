/*
* carebot-tracker.js is library that checks if an element is visible on the page
* and reports it to pym.js.
* Check out the readme at README.md for usage.
*/

/*globals define, attachEvent, addEventListener: true */
/* global module, console */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        window.CarebotTracker = factory.call(this);
    }
})(function() {
    var lib = {};

    /**
     * Timer
     * @param {Function} callback Called every time a new time bucket is reached
     *
     * Interface:
     *
     */
    lib.Timer = function(callback) {
        // From https://github.com/nprapps/elections16/blob/master/www/js/app.js#L298-L335
        var totalSeconds = 0;
        var previousBucket;
c
        function getTimeBucket(seconds) {
            var minutes, timeBucket;
            if (seconds < 60) {
                var tensOfSeconds = Math.floor(seconds / 10) * 10;
                timeBucket = tensOfSeconds.toString() + 's';
            } else if (seconds >=60 && seconds < 300) {
                minutes = Math.floor(seconds / 60);
                timeBucket = minutes.toString() + 'm';
            } else {
                minutes = Math.floor(seconds / 60);
                var fivesOfMinutes = Math.floor(minutes / 5) * 5;
                timeBucket = fivesOfMinutes.toString() + 'm';
            }

            return timeBucket;
        }

        function reportBucket() {
            var bucket = getTimeBucket(totalSeconds);
            if (bucket !== previousBucket) {
                callback({
                    bucket: bucket,
                    seconds: totalSeconds
                });
                previousBucket = bucket;
            }
        }

        function add(seconds) {
            totalSeconds += seconds;
            reportBucket();
        }

        return {
            add: add,
            getTimeBucket: getTimeBucket
        };
    }.bind(this);

    /**
     * Tracks how long an element is visible.
     *
     * @class Parent
     * @param {String} id The id of the element the tracker will watch.
     * @param {Function} callback Will be called on every new time bucket.
     * @param {Object} config Configuration to override the default settings.
     */
    lib.VisibilityTracker = function(id, callback, config) {
        var timer = new lib.Timer(function(data) {
            callback(data);
        });

        $.screentime({
          fields: [
            { selector: '#' + id,
              name: 'graphic'
            }
          ],
          callback: function(data) {
            timer.add(data.graphic);
          }
        });
    };

    /**
     * Tracks scroll depth
     */
    lib.ScrollTracker = function(id) {
        id = id || '#'
    }

    return lib;
});

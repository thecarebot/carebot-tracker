/*
* carebot-tracker.js is library that checks if an element is visible on the page
* and reports it to pym.js.
* Check out the readme at README.md for usage.
*/

/*globals define, attachEvent, addEventListener: true */
/* global module */

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

    lib.Timer = function() {
        // From https://github.com/nprapps/elections16/blob/master/www/js/app.js#L298-L335
        var startTime;

        function getTimeBucket(seconds) {
            if (seconds < 60) {
                var tensOfSeconds = Math.floor(seconds / 10) * 10;
                var timeBucket = tensOfSeconds.toString() + 's';
            } else if (seconds >=60 && seconds < 300) {
                var minutes = Math.floor(seconds / 60);
                var timeBucket = minutes.toString() + 'm';
            } else {
                var minutes = Math.floor(seconds / 60);
                var fivesOfMinutes = Math.floor(minutes / 5) * 5;
                var timeBucket = fivesOfMinutes.toString() + 'm';
            }

            return timeBucket;
        };

        function calculateTimeBucket(startTime) {
            var currentTime = new Date();
            var totalTime = Math.abs(currentTime - startTime);
            var seconds = Math.floor(totalTime/1000);
            var timeBucket = this.getTimeBucket(seconds);

            return [timeBucket, totalTime];
        }

        function check() {
            return calculateTimeBucket(startTime);
        }

        function start() {
            startTime = new Date();
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
        this.MS_WAIT = 50;

        this.id = id;
        this.el = document.getElementById(id);
        this.timeout = undefined;
        this.isVisible = false;

        this.timer = new lib.Timer();

        // Ensure a config object
        config = (config || {});


        this.onBucket = function() {
            // TODO
            callback(this.lastBucket);
        }.bind(this);

        this.startTimer = function() {
            // TODO
        };

        this.stopTimer = function() {
            // TODO
        };

        this.isElementInViewport = function(el) {
            // Via http://stackoverflow.com/a/15203639/117014
            var rect     = el.getBoundingClientRect(),
                vWidth   = window.innerWidth || doc.documentElement.clientWidth,
                vHeight  = window.innerHeight || doc.documentElement.clientHeight,
                efp      = function (x, y) { return document.elementFromPoint(x, y) };

            // Return false if it's not in the viewport
            if (rect.right < 0 || rect.bottom < 0
                    || rect.left > vWidth || rect.top > vHeight)
                return false;

            // Return true if any of its four corners are visible
            return (
                  el.contains(efp(rect.left,  rect.top))
              ||  el.contains(efp(rect.right, rect.top))
              ||  el.contains(efp(rect.right, rect.bottom))
              ||  el.contains(efp(rect.left,  rect.bottom))
            );
        };

        this.checkIfVisible = function() {
            var newVisibility = this.isElementInViewport(this.el);
            console.log(this.isVisible, newVisibility);

            if (this.isVisible && !newVisibility) {
                console.log("Became hidden");
                console.log(this.timer.check());
                // The item has become invisible
                // TODO
                // Start the timer
            }

            if (!this.isVisible && newVisibility) {
                console.log("Became visible");
                console.log(this.timer);
                this.timer.start();
                // The item has become visible
                // Stop the timer
            }

            this.isVisible = newVisibility;
            return newVisibility;
        }.bind(this);

        this.handler = function() {
            // Only register a new event every 1/10 of a second
            // That way we don't record an absurd number of events
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
            this.timeout = window.setTimeout(this.checkIfVisible, this.MS_WAIT);
        }.bind(this);

        // Listen to different window movement events
        if (window.addEventListener) {
            addEventListener('DOMContentLoaded', this.handler, false);
            addEventListener('load', this.handler, false);
            addEventListener('scroll', this.handler, false);
            addEventListener('resize', this.handler, false);
        } else if (window.attachEvent)  {
            attachEvent('onDOMContentLoaded', this.handler); // IE9+ :(
            attachEvent('onload', this.handler);
            attachEvent('onscroll', this.handler);
            attachEvent('onresize', this.handler);
        }

        // Add any overrides to settings coming from config.
        var key;
        for (key in config) {
            this.settings[key] = config[key];
        }
        return this;
    }.bind(this);

    return lib;
});

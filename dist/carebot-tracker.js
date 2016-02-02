/*! carebot-tracker - v0.1.0 - 2016-02-02 */
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
    } else if (module !== undefined && module.exports) {
        module.exports = factory();
    } else {
        window.carebot_tracker = factory.call(this);
    }
})(function() {
    var lib = {};

    /**
     * Tracks how long an element is visible.
     *
     * @class Parent
     * @param {String} id The id of the element the tracker will watch.
     * @param {Function} callback Will be called on every new time bucket.
     * @param {Object} config Configuration to override the default settings.
     */
    lib.VisibilityTracker = function(id, callback, config) {
        this.MS_WAIT = 100;

        this.id = id;
        this.el = document.getElementById(id);
        this.timeout = undefined;
        this.isVisible = false;

        // Ensure a config object
        config = (config || {});

        this.onBucket = function() {
            // TODO
            callback(this.lastBucket);
        };

        this.startTimer = function() {
            // TODO
        };

        this.stopTimer = function() {
            // TODO
        };

        this.isElementInViewport = function(el) {
            var rect = el.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );
        };

        this.checkIfVisible = function() {
            var newVisibility = this.isElementInViewport(this.el);

            if (this.isVisible && !newVisibility) {
                // The item has become invisible
                // TODO
                // Start the timer
            }

            if (!this.isVisible && newVisibility) {
                // The item has become visible
                // Stop the timer
            }

            this.isVisible = newVisibility;
            return newVisibility;
        };

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
    };

    return lib;
});

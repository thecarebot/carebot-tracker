/*! carebot-tracker - v0.5.0 - 2016-03-02 */
/*!
 * @preserve
 * Screentime.js | v0.2
 * Copyright (c) 2015 Rob Flaherty (@robflaherty)
 * Licensed under the MIT and GPL licenses.
 */

(function($, window, document) {

  var defaults = {
    fields: [],
    percentOnScreen: '50%',
    reportInterval: 10,
    googleAnalytics: false,
    callback: function(){}
  };

  $.screentime = function(options) {
    options = $.extend({}, defaults, options);

    // Convert perecent string to number
    options.percentOnScreen = parseInt(options.percentOnScreen.replace('%', ''), 10);

    var counter = {};
    var cache = {};
    var log = {};
    var looker = null;
    var started = false;
    var universalGA, classicGA;

    if (!options.fields.length) {
      return;
    }

    if (options.googleAnalytics) {

      if (typeof ga === "function") {
        universalGA = true;
      }

      if (typeof _gaq !== "undefined" && typeof _gaq.push === "function") {
        classicGA = true;
      }

    }

    /*
     * Utilities
     */

    /*!
     * visibly - v0.6 Aug 2011 - Page Visibility API Polyfill
     * http://github.com/addyosmani
     * Copyright (c) 2011 Addy Osmani
     * Dual licensed under the MIT and GPL licenses.
     *
     * Methods supported:
     * visibly.onVisible(callback)
     * visibly.onHidden(callback)
     * visibly.hidden()
     * visibly.visibilityState()
     * visibly.visibilitychange(callback(state));
     */

    (function(){window.visibly={q:document,p:undefined,prefixes:["webkit","ms","o","moz","khtml"],props:["VisibilityState","visibilitychange","Hidden"],m:["focus","blur"],visibleCallbacks:[],hiddenCallbacks:[],genericCallbacks:[],_callbacks:[],cachedPrefix:"",fn:null,onVisible:function(i){if(typeof i=="function"){this.visibleCallbacks.push(i)}},onHidden:function(i){if(typeof i=="function"){this.hiddenCallbacks.push(i)}},getPrefix:function(){if(!this.cachedPrefix){for(var i=0;b=this.prefixes[i++];){if(b+this.props[2]in this.q){this.cachedPrefix=b;return this.cachedPrefix}}}},visibilityState:function(){return this._getProp(0)},hidden:function(){return this._getProp(2)},visibilitychange:function(i){if(typeof i=="function"){this.genericCallbacks.push(i)}var t=this.genericCallbacks.length;if(t){if(this.cachedPrefix){while(t--){this.genericCallbacks[t].call(this,this.visibilityState())}}else{while(t--){this.genericCallbacks[t].call(this,arguments[0])}}}},isSupported:function(i){return this.cachedPrefix+this.props[2]in this.q},_getProp:function(i){return this.q[this.cachedPrefix+this.props[i]]},_execute:function(i){if(i){this._callbacks=i==1?this.visibleCallbacks:this.hiddenCallbacks;var t=this._callbacks.length;while(t--){this._callbacks[t]()}}},_visible:function(){window.visibly._execute(1);window.visibly.visibilitychange.call(window.visibly,"visible")},_hidden:function(){window.visibly._execute(2);window.visibly.visibilitychange.call(window.visibly,"hidden")},_nativeSwitch:function(){this[this._getProp(2)?"_hidden":"_visible"]()},_listen:function(){try{if(!this.isSupported()){if(this.q.addEventListener){window.addEventListener(this.m[0],this._visible,1);window.addEventListener(this.m[1],this._hidden,1)}else{if(this.q.attachEvent){this.q.attachEvent("onfocusin",this._visible);this.q.attachEvent("onfocusout",this._hidden)}}}else{this.q.addEventListener(this.cachedPrefix+this.props[1],function(){window.visibly._nativeSwitch.apply(window.visibly,arguments)},1)}}catch(i){}},init:function(){this.getPrefix();this._listen()}};this.visibly.init()})();

    function random() {
      return Math.round(Math.random() * 2147483647);
    }

    /*
     * Constructors
     */

    function Field(elem) {
      this.selector = elem.selector;
      $elem = this.$elem = $(elem.selector);
      this.name = elem.name;

      this.top = $elem.offset().top;
      this.height = $elem.height();
      this.bottom = this.top + this.height;
      this.width = $elem.width();
    }

    function Viewport() {
      var $window = $(window);

      this.top = $window.scrollTop();
      this.height = $window.height();
      this.bottom = this.top + this.height;
      this.width = $window.width();
    }

    /*
     * Do Stuff
     */

    function sendGAEvent(field, time) {

      if (universalGA) {
        ga('send', 'event', 'Screentime', 'Time on Screen', field, parseInt(time, 10), {'nonInteraction': true});
      }

      if (classicGA) {
        _gaq.push(['_trackEvent', 'Screentime', 'Time on Screen', field, parseInt(time, 10), true]);
      }

    }

    function onScreen(viewport, field) {
      var cond, buffered, partialView;

      // Field entirely within viewport
      if ((field.bottom <= viewport.bottom) && (field.top >= viewport.top)) {
        return true;
      }

       // Field bigger than viewport
      if (field.height > viewport.height) {

        cond = (viewport.bottom - field.top) > (viewport.height / 2) && (field.bottom - viewport.top) > (viewport.height / 2);

        if (cond) {
          return true;
        }

      }

      // Partially in view
      buffered = (field.height * (options.percentOnScreen/100));
      partialView = ((viewport.bottom - buffered) >= field.top && (field.bottom - buffered) > viewport.top);

      return partialView;

    }

    function checkViewport() {
      var viewport = new Viewport();

      $.each(cache, function(key, val) {
        if (onScreen(viewport, val)) {
          log[key] += 1;
          counter[key] += 1;
        }
      });

    }

    function report() {

      var data = {};

      $.each(counter, function(key, val) {
        if (val > 0) {
          data[key] = val;
          counter[key] = 0;

          if (options.googleAnalytics) {
            sendGAEvent(key, val);
          }

        }
      });

      if (!$.isEmptyObject(data)) {
        options.callback.call(this, data, log);
      }

    }

    function startTimers() {

      if (!started) {
        checkViewport();
        started = true;
      }

      looker = setInterval(function() {
        checkViewport();
      }, 1000);

      reporter = setInterval(function() {
        report();
      }, options.reportInterval * 1000);

    }

    function stopTimers() {
      clearInterval(looker);
      clearInterval(reporter);
    }

    $.screentime.reset = function() {
      stopTimers();

      $.each(cache, function(key, val) {
        log[key] = 0;
        counter[key] = 0;
      });

      startTimers();
    }

    function init() {

      $.each(options.fields, function(index, elem) {
        if ($(elem.selector).length) {
          var field = new Field(elem);
          cache[field.name] = field;
          counter[field.name] = 0;
          log[field.name] = 0;
        }
      });

      startTimers();

      visibly.onHidden(function() {
        stopTimers();
      });

      visibly.onVisible(function() {
        stopTimers();
        startTimers();
      });

    }

    init();

  };

})(jQuery, window, document);

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
    lib.ScrollTracker = function(id, callback, config) {
        var WAIT_TO_ENSURE_SCROLLING_IS_DONE = 100;
        var elt = document.getElementById(id);
        var previousBucket = 0;
        var timeout;

        function getPageScroll() {
            var body = document.body;
            var docEl = document.documentElement;


            var scrollTop;
            var scrollLeft;

            if (window.hasOwnProperty('pageYOffset')) {
                scrollTop = window.pageYOffset;
                scrollLeft = window.pageXOffset;
            } else if (docEl.hasOwnProperty('scrollTop')) {
                scrollTop = docEl.scrollTop;
                scrollLeft = docEl.scrollLeft;
            } else {
                scrollTop = body.scrollTop;
                scrollLeft = body.scrollLeft;
            }

            return {
                scrollTop: scrollTop,
                scrollLeft: scrollLeft
            };
        }

        function getCoords(elem) {
            // via http://stackoverflow.com/a/26230989/117014
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docEl = document.documentElement;

            var scroll = getPageScroll();
            var scrollTop = scroll.scrollTop;
            var scrollLeft = scroll.scrollLeft;

            if (window.hasOwnProperty('pageYOffset')) {
                scrollTop = window.pageYOffset;
                scrollLeft = window.pageXOffset;
            } else if (docEl.hasOwnProperty('scrollTop')) {
                scrollTop = docEl.scrollTop;
                scrollLeft = docEl.scrollLeft;
            } else {
                scrollTop = body.scrollTop;
                scrollLeft = body.scrollLeft;
            }

            var clientTop = docEl.clientTop || body.clientTop || 0;
            var clientLeft = docEl.clientLeft || body.clientLeft || 0;

            var top  = box.top +  scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return {
                top: Math.round(top),
                left: Math.round(left)
            };
        }

        function depthPercent() {
            var eltTopPosition = getCoords(elt).top;
            var articleHeight = elt.offsetHeight;
            var eltBottomPosition = eltTopPosition + articleHeight;
            var scrollTop = getPageScroll().scrollTop;
            var scrollBottom = scrollTop + window.innerHeight;
            var percent = (scrollBottom - eltTopPosition) / articleHeight;

            return percent;
        }

        function percentBucket(n) {
            return Math.round(n * 10) * 10;
        }

        function trackDepth() {
            var percent = depthPercent();
            var bucket = percentBucket(percent);
            if (bucket > previousBucket) {
                previousBucket = bucket;
                callback(bucket);
            }
        }

        window.addEventListener('scroll', function(event) {
            if (timeout) {
                window.clearTimeout(timeout);
            }
            timeout = window.setTimeout(trackDepth, WAIT_TO_ENSURE_SCROLLING_IS_DONE);
        });

    };

    return lib;
});

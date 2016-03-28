# Carebot Tracker

[![Build Status](https://travis-ci.org/thecarebot/carebot-tracker.svg?branch=master)](https://travis-ci.org/thecarebot/carebot-tracker)

A tool for tracking analytics that matter.

## Using the Tracker

### Visibility Tracker

The Visibility Tracker records how long an element has been on screen. After
including `carebot-tracker.js` on a page, here's how you initailize the tracker:

```
var tracker = new CarebotTracker.VisibilityTracker('element-id', function(bucket) {
  console.log("The user has seen the graphic for " + bucket);
});
```

### ScrollTracker

The ScrollTracker measures how much of a given element has been "read" (passed
the bottom of the screen). As you scroll down, it'll record every 10% of an
an element you read, as well as how long you've spent on the page so far.

If you scroll down, then up, then down again, it'll re-record those percentages
with the new time you hit them.

Here's an example of how to add the tracker:

```
var tracker = new CarebotTracker.ScrollTracker('element-id', function(percent, seconds) {
  pymParent.sendMessage('scroll-depth', {
    percent: percent,  // Percents as a number: "10", "120"
    seconds: seconds
  });
});
```

### How to send the data to Google Analytics

Every analytics platform and implementation is slightly different. Here's an
example of how we send the data to GA:

```
<script type="text/javascript" src="carebot-tracker.min.js"></script>
<script type="text/javascript">
var tracker = new CarebotTracker.ScrollTracker('element-id', function(percent, seconds) {
  var eventData = {
    'hitType': 'event',
    'eventCategory': 'your-page-slug-here', // something to identify the story later
    'eventAction': 'scroll-depth',
    'eventLabel': result,
    'eventValue': seconds
  };
  ga('send', eventData); // Assumes GA has already been set up.
});
</script>
```

### Timer

The timer is a utility class that works like a stopwatch.

#### Time buckets

The timer's special feature is that it returns times in the
standard NPR time buckets as strings (in addition to a plain `seconds` count).

The time buckets are:
* From zero up to 59 seconds: 10 second intervals (eg `10s`, `20s`, `30s`...)
* 60 up to 300 seconds: one-minute intervals (eg `1m`, `2m`...)
* More than 300 seconds: five-minute intervals (eg `5m`, `10m`...)

#### Methods

##### Constructor

```
var timer = new CarebotTracker.Timer();
```

An optional callback will be called on every new bucket:

```
var timer = new CarebotTracker.Timer(function(result) {
  console.log(result.bucket, result.seconds);
});
```

##### `start`

Starts the timer.

```
var timer = new CarebotTracker.Timer();
timer.start();
```

##### `pause`

Pauses the timer. Note that this does not zero out the timer value.

```
var timer = new CarebotTracker.Timer();
timer.start();
timer.pause();
```

##### `check`
Gets the seconds elapsed and current time bucket

```
var timer = new CarebotTracker.Timer();
timer.start();
// wait 300 seconds
console.log(timer.check());
// prints { bucket: '5m', seconds: 300 }
```

#### Example

```
var timer = new CarebotTracker.Timer();
timer.start();
// wait 300 seconds
timer.pause();

console.log(timer.check());
// prints { bucket: '5m', seconds: 300 }

timer.start();
// wait 60 seconds
timer.check();
// prints { bucket: '5m', seconds: 360 }
```

## Development

Here's what you need to make Carebot Tracker better.

### Getting started

You'll need node and npm to get started.

After installing node, you can install the dependencies by running `npm install`.

### Developing

Run `grunt watch` from the project root to track changes, automatically lint the JS, and build the minimized and source versions that end up in `/dist`.

### Building

Run `grunt` from the project root to lint the files and package them in `/dist`.

### Testing

Run `mocha` from the project root to run the test suite.

To manually test while developing, start a simple server from the project root:

```
python -m SimpleHTTPServer 8000
```

And then load load http://localhost:8000/test/index.html

This is less than ideal and should be replaced with an automated selenium test rig.

# Carebot Tracker

[![Build Status](https://travis-ci.org/thecarebot/carebot-tracker.svg?branch=master)](https://travis-ci.org/thecarebot/carebot-tracker)

[Carebot](http://thecarebot.github.io) is an effort in thinking about alternative ways to look at analytics for journalism: both the measures and indicators used to understand story impact, and the way which analytics data is used in the newsroom. 

This repository has the trackers you'll put on your website to measure interactions with your articles. You might also want to run the [Carebot Slackbot](https://github.com/thecarebot/carebot#carebot-the-slackbot) to report data through notifications.

## Quickstart

If you are using Google Analytics, here's how to include the carebot tracker and start tracking 
how much of an article someone has read. Put this code after the Google Analytics code block.
You'll need to change `element-id` to match the CSS ID of the article on your page. 

```
<script type="text/javascript" src="carebot-tracker.min.js"></script>
<script type="text/javascript">
var tracker = new CarebotTracker.ScrollTracker('element-id', function(percent, seconds) {
  var eventData = {
    'hitType': 'event',
    'eventCategory': 'your-page-slug-here', // something to identify the story later
    'eventAction': 'scroll-depth',
    'eventLabel': percent,
    'eventValue': seconds
  };
  ga('send', eventData); // Assumes GA has already been set up.
});
</script>
```

## The trackers

Here are more details on the two trackers available and how to use them:

### Time on Screen Tracker

The Visibility Tracker records how long an element is visible on screen. 
It reports the time in standard buckets: 
* From zero up to 59 seconds: 10 second intervals (eg `10s`, `20s`, `30s`...)
* 60 up to 300 seconds: one-minute intervals (eg `1m`, `2m`...)
* More than 300 seconds: five-minute intervals (eg `5m`, `10m`...)

Here's how to setup this tracker:

```
<script type="text/javascript" src="carebot-tracker.min.js"></script>
<script type="text/javascript">
var tracker = new CarebotTracker.VisibilityTracker('element-id', function(bucket) {
  console.log("The user has seen the graphic for " + bucket); // eg "10s", "2m"
});
</script>
```

### Scroll Depth Tracker

The ScrollTracker measures how much of a given element has been "read" (passed
the bottom of the screen). As you scroll down, it'll record every 10% of an
an element you read, as well as how long you've spent on the page so far in seconds.

If you scroll down, then up, then down again, it'll re-record those percentages
with the new time you hit them.

Replace `element-id` with the ID of the element you want measure scroll depth for.
Usually, this is the ID of the main article on the page. 

Here's an example of how to add the tracker:

```
<script type="text/javascript" src="carebot-tracker.min.js"></script>
<script type="text/javascript">
var tracker = new CarebotTracker.ScrollTracker('element-id', function(percent, seconds) {
  console.log("The user has gone", percent, "percent down the page after", seconds, "seconds");
});
</script>
```

### How to send the data to Pym
This is a rare edge case (we set it up to meet NPR's specific implementation). 
If you're using [pym](https://github.com/nprapps/pym.js)_and) your graphic uses a 
different analytics property than the parent page, you can pass in the bucket 
values to the pym child using code like this: 

```
var tracker = new CarebotTracker.ScrollTracker('element-id', function(percent, seconds) {
console.log("
  pymParent.sendMessage('scroll-depth', {
    percent: percent,  // Percents as a number: "10", "120"
    seconds: seconds
  });
});
```

### Timer

The timer is a utility class that works like a stopwatch.
You probably won't need to use it directly unless you're building a new tracker. 

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

## Alternatives

If you're using jquery on the page, these plugins by Rob Flaherty could simplify your life and can act as replacements for pym: 
* [Scroll Depth](http://scrolldepth.parsnip.io/)
* [Riveted](http://riveted.parsnip.io/) for measuring active time on site
* [Screentime](http://screentime.parsnip.io/) for measuring time an element is on screen

***

## Contribute to the project
Here are a few ways you can help make Carebot more useful:

1. Fix bugs in the Carebot [tracker](https://github.com/thecarebot/carebot-tracker) and [slackbot](https://github.com/thecarebot/carebot).
2. Report new [new issues](https://github.com/thecarebot/carebot/issues/new) you find.
3. Contribute new metrics to the Carebot tracker via pull request.
4. Contribute new notification methods to Carebot via pull request (SMS, Hipchat, etc).
5. Add to or edit [this documentation](https://github.com/thecarebot/carebot-tracker/blob/master/README.md).
6. [Tell people](http://twitter.com) about Carebot and how more meaningful analytics can help them.


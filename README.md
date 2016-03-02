# Carebot Tracker

[![Build Status](https://travis-ci.org/thecarebot/carebot-tracker.svg?branch=master)](https://travis-ci.org/thecarebot/carebot-tracker)

A tool for tracking analytics that matter.

## Using the Tracker

### Visibiltiy Tracker

The Visibility Tracker records how long an element has been on screen. After
including `carebot-tracker.js` on a page, here's how you initailize the tracker:

```
var tracker = new CarebotTracker.VisibilityTracker('element-id', function(bucket) {
  console.log("The user has seen the graphic for " + bucket);
});
```


### ScrollTracker

### Timer

The timer is a utility class .



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

To manually test while developing, start a simple server from the project
root:

```
python -m SimpleHTTPServer 8000
```

And then load load http://localhost:8000/test/index.html

This is less than ideal and should be replaced with an automated selenium
test rig.



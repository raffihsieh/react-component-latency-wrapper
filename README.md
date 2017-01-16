# react-latency-collector
Wrapper around React.Component that measures component render times. 

This is built on top of Eric Bidelman's (@ebidel) appmetrics.js found here: https://github.com/ebidel/appmetrics.js

## Install
npm install --save react-latency-collector

## How to Use
```js
import React from 'react';
import LatencyWrapper from 'react-latency-collector';

class App extends LatencyWrapper.Component {
  constructor(props) {
    super(props, <METRIC LABEL>, <LOG LEVEL>, <ANALYTICS CALLBACK>);
  }
  ...
}
export default App;
```

Alternatively, you can use the latency collector itself instead of extending the wrapper component

```js
import React from 'react';
import latencyCollector from 'react-latency-collector';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    this.latencyCollector = new latencyCollector(<METRIC LABEL>);
    this.latencyCollector.start();
    ...
    this.latencyCollector.end();
    this.latencyCollector.log();
  }
}
```

## Reporting Metrics
In order to report metrics, you can provide a callback to the LatencyComponent constructor. 
If a callback is specified, the wrapper will invoked the callback with the arguments 
```callback(metricLabel, metricDuration)```
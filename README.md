# react-latency-collector
Wrapper around React.Component that measures component render times. 

This is highly influenced by Eric Bidelman's (@ebidel) appmetrics.js which can be found here: https://github.com/ebidel/appmetrics.js

## Install
npm install --save react-latency-collector

## How to Use

The react-latency-collector component will automatically measure render time and output the results to either the console and/or to whatever data store you define. 
It is meant to be used as a replacement for react.Component so you don't need to set up a new latency collector for every single one of your components. 
Use this exactly as you would react.Component

```js
import React from 'react';
import LatencyWrapper from 'react-latency-collector';

class App extends LatencyWrapper.Component {
  constructor(props) {
    super(props, <OPTIONAL METRIC LABEL>, <OPTIONAL LOG LEVEL>, <OPTIONAL ANALYTICS PUBLISHER>);
  }
  ...
}
export default App;
```

Alternatively, you can use the latency collector itself without the wrapper component.

```js
import React from 'react';
import LatencyCollector from 'react-latency-collector'.Collector;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.latencyCollector = new LatencyCollector(<METRIC LABEL>, <LOG LEVEL>);
    this.latencyCollector.start();
  }
  
  componentDidMount() {
    this.latencyCollector.end();
    this.latencyCollector.log();
    this.latencyCollector.publishMetrics(<METRIC PUBLISHING CALLBACK>);
  }
  
  componentWillUpdate() {
    ...
  }
  
  componentDidUpdate() {
    ...
  }
}
```

### Optional Constructor Arguments

#### Metric Label
The default metric label is "<component className>_render_latency".

#### Log Level
The log level hierarchy is as follows:
1. debug
2. warn
3. error
4. off

#### Analytics Publisher
You can provide a callback for the react-latency-collector to call. The callback must accept 2 arguments
1. The Metric Label
2. The Latency value (ms)

## Gotcha's
The LatencyWrapper component makes use of the Component lifecycle methods. If you are using your own lifecycle methods, it will override these. Instead of using inheritence, it may be better to use composition.

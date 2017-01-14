import React from 'react';
import logLevelHierarchy from './logLevelHierarchy';
import latencyCollector from './LatencyCollector';

class LatencyWrapper extends React.Component {

	constructor(props, metricLabel = this.constructor.name + '_render_latency', 
			logLevel = 'off', analyticsCallback = this.defaultAnalyticsCallback) {
		super(props);
		this.logLevel = logLevel;
		this.analyticsCallback = analyticsCallback.bind(this);
		this.componentCollector = new latencyCollector.collector(metricLabel, logLevelHierarchy[logLevel]);
		this.componentCollector.start();
	}

	componentDidMount() {
		this.componentCollector.end();
		this.componentCollector.log();
	}

	componentWillUpdate() {
		this.componentCollector.start();
	}

	componentDidUpdate() {
		this.componentCollector.end();
		this.componentCollector.log();
	}

	defaultAnalyticsCallback(metricLabel, metricData) {
		console.log("test for callback: " + metricLabel + ": " + metricData)
	}

}

exports.Component = LatencyWrapper;
exports.Collector = latencyCollector;

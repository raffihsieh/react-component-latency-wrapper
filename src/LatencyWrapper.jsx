import React from 'react';
import LatencyCollector from './LatencyCollector';

class LatencyWrapper extends React.Component {

	constructor(props, metricLabel,	logLevel = 'off', analyticsCallback = null) {
		super(props);
		console.log(metricLabel);
		let label = metricLabel;
		if(!label) {
			label = this.constructor.name + '_render_latency';
		}
		this.analyticsCallback = analyticsCallback;
		this.componentCollector = new LatencyCollector(label, logLevel);
		this.componentCollector.start();
	}

	componentDidMount() {
		this.componentCollector.end();
		this.componentCollector.log();
		if (this.analyticsCallback) {
			this.componentCollector.publishMetrics(this.analyticsCallback);
		}
	}

	componentWillUpdate() {
		this.componentCollector.start();
	}

	componentDidUpdate() {
		this.componentCollector.end();
		this.componentCollector.log();
		if (this.analyticsCallback) {
			this.componentCollector.publishMetrics(this.analyticsCallback);
		}
	}

}

exports.Component = LatencyWrapper;
exports.Collector = LatencyCollector;

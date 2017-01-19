import React from 'react'
import LatencyCollector from './LatencyCollector';

class LatencyWrapper extends React.Component {
	constructor(props, metricLabel, logLevel = 'off', analyticsCallback = null) {
		super(props);
		let label = metricLabel;
		if(!label) {
			label = this.constructor.name + '_render_latency';
		}
	}
}

exports.Component = LatencyWrapper;
exports.Collector = LatencyCollector;

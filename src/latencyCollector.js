/* eslint-disable no-unused-vars */

/**
 * This is a modified version of Eric Bidelman <ebidel@>'s appmetrics.js https://github.com/ebidel/appmetrics.js/blob/master/src/appmetrics.js
 */

'use strict';

import logLevelHierarchy from './logLevelHierarchy';

// Private members.
let _start = new WeakMap();
let _end = new WeakMap();

class LatencyCollector {

  /**
   * True if the the browser supports the Navigation Timing API.
   * @type {boolean}
   * @static
   */
  static get supportsPerfNow() {
    return performance && performance.now;
  }

  /**
   * True if the the browser supports the User Timing API.
   * @type {boolean}
   * @static
   */
  static get supportsPerfMark() {
    return performance && performance.mark;
  }

  /**
   * Returns the duration of the timing metric or -1 if there a measurement has
   * not been made.
   * @type {number}
   */
  get duration() {
    let duration = _end.get(this) - _start.get(this);

    // Use User Timing API results if available, otherwise return
    // performance.now() fallback.
    if (Metric.supportsPerfMark) {
      // Note: this assumes the user has made only one measurement for the given
      // name. Return the first one found.
      const entry = performance.getEntriesByName(this.name)[0];
      if (entry && entry.entryType !== 'measure') {
        duration = entry.duration;
      }
    }

    return duration || -1;
  }

  /**
   * @param {string} name A name for the metric.
   */
	constructor(name, logLevel = 0) {
		this.logLevel = logLevel;
    if (!name) {
      throw Error('Please provide a metric name');
    }

		if (!Metric.supportsPerfMark) {
			if(this.logLevel >= logLevelHierarchy.warn) {
				console.warn(`Timeline won't be marked for "${name}".`);
			}

      if (!Metric.supportsPerfNow) {
        throw Error('This library cannot be used in this browser.');
      }
    }

    this.name = name;
  }

  /**
   * Call to begin a measurement.
   * @return {Metric} Instance of this object.
   */
  start() {
		if (_start.get(this) && this.logLevel > logLevelHierarchy.warn) {
      console.warn('Overwriting previous value...');
    }

    _start.set(this, performance.now());

    // Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
    if (Metric.supportsPerfMark) {
      performance.mark(`mark_${this.name}_start`);
    }

    return this;
  }

  /**
   * Call to end a measurement.
   * @return {Metric} Instance of this object.
   */
  end() {
		if (_end.get(this) && this.logLevel > logLevelHierarchy.warn) {
      console.warn('Overwriting previous value...');
    }

    _end.set(this, performance.now());

    // Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
    if (Metric.supportsPerfMark) {
      let startMark = `mark_${this.name}_start`;
      let endMark = `mark_${this.name}_end`;
      performance.mark(endMark);
      performance.measure(this.name, startMark, endMark);
    }

    return this;
  }

  /**
   * Prints the metric's duration to the console.
   * @return {Metric} Instance of this object.
   */
	log() {
		if (this.logLevel >= logLevelHierarchy.debug) {
			console.log(this.name, this.duration, 'ms');
		}
    return this;
  }

}

module.export = LatencyCollector;

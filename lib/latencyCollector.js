/* eslint-disable no-unused-vars */

/**
 * This is a modified version of Eric Bidelman <ebidel@>'s appmetrics.js https://github.com/ebidel/appmetrics.js/blob/master/src/appmetrics.js
 */

'use strict';

// Private members.

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _start = new WeakMap();
var _end = new WeakMap();

var logLevelHierarchy = {
  'debug': 3,
  'warn': 2,
  'error': 1,
  'off': 0
};

var LatencyCollector = function () {
  /**
   * @param {string} name A name for the metric.
   */
  function LatencyCollector(name) {
    var logLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'off';

    _classCallCheck(this, LatencyCollector);

    this.logLevel = logLevelHierarchy[logLevel];
    if (!name) {
      throw Error('Please provide a metric label');
    }

    if (!LatencyCollector.supportsPerfMark) {
      if (this.logLevel >= logLevelHierarchy.warn) {
        console.warn('Timeline won\'t be marked for "' + name + '".');
      }

      if (!LatencyCollector.supportsPerfNow) {
        throw Error('This library cannot be used in this browser.');
      }
    }

    this.name = name;
  }

  /**
   * Returns the duration of the timing metric or -1 if there a measurement has
   * not been made.
   * @type {number}
   */


  _createClass(LatencyCollector, [{
    key: 'getLabel',
    value: function getLabel() {
      return this.name;
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.duration;
    }

    /**
     * True if the the browser supports the Navigation Timing API.
     * @type {boolean}
     * @static
     */

  }, {
    key: 'log',


    /**
     * Prints the metric's duration to the console.
     * @return {Metric} Instance of this object.
     */
    value: function log() {
      if (this.logLevel >= logLevelHierarchy.debug) {
        console.log(this.name, this.duration, 'ms');
      }
      return this;
    }
  }, {
    key: 'publishMetrics',
    value: function publishMetrics(analyticsCallback) {
      try {
        analyticsCallback(this.name, this.duration);
      } catch (e) {
        console.error('Publishing metrics failed.', e);
      }
    }

    /**
     * Call to begin a measurement.
     * @return {Metric} Instance of this object.
     */

  }, {
    key: 'start',
    value: function start() {
      if (_start.get(this) && this.logLevel > logLevelHierarchy.warn) {
        console.warn('Overwriting previous value...');
      }

      _start.set(this, window.performance.now());

      // Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
      if (LatencyCollector.supportsPerfMark) {
        window.performance.mark('mark_' + this.name + '_start');
      }

      return this;
    }

    /**
     * Call to end a measurement.
     * @return {Metric} Instance of this object.
     */

  }, {
    key: 'end',
    value: function end() {
      if (_end.get(this) && this.logLevel > logLevelHierarchy.warn) {
        console.warn('Overwriting previous value...');
      }

      _end.set(this, window.performance.now());

      // Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
      if (LatencyCollector.supportsPerfMark) {
        var startMark = 'mark_' + this.name + '_start';
        var endMark = 'mark_' + this.name + '_end';
        window.performance.mark(endMark);
        window.performance.measure(this.name, startMark, endMark);
      }

      return this;
    }
  }, {
    key: 'duration',
    get: function get() {
      var duration = _end.get(this) - _start.get(this);

      // Use User Timing API results if available, otherwise return
      // performance.now() fallback.
      if (LatencyCollector.supportsPerfMark) {
        // Note: this assumes the user has made only one measurement for the given
        // name. Return the first one found.
        var entry = window.performance.getEntriesByName(this.name)[0];
        if (entry && entry.entryType !== 'measure') {
          duration = entry.duration;
        }
      }

      return duration || -1;
    }
  }], [{
    key: 'supportsPerfNow',
    get: function get() {
      return window.performance && window.performance.now;
    }

    /**
     * True if the the browser supports the User Timing API.
     * @type {boolean}
     * @static
     */

  }, {
    key: 'supportsPerfMark',
    get: function get() {
      return window.performance && window.performance.mark;
    }
  }]);

  return LatencyCollector;
}();

module.exports = LatencyCollector;
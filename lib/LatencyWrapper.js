'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LatencyCollector = require('./LatencyCollector');

var _LatencyCollector2 = _interopRequireDefault(_LatencyCollector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LatencyWrapper = function (_React$Component) {
	_inherits(LatencyWrapper, _React$Component);

	function LatencyWrapper(props, metricLabel) {
		var logLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'off';
		var analyticsCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, LatencyWrapper);

		var _this = _possibleConstructorReturn(this, (LatencyWrapper.__proto__ || Object.getPrototypeOf(LatencyWrapper)).call(this, props));

		console.log(metricLabel);
		var label = metricLabel;
		if (!label) {
			label = _this.constructor.name + '_render_latency';
		}
		_this.analyticsCallback = analyticsCallback;
		_this.componentCollector = new _LatencyCollector2.default(label, logLevel);
		_this.componentCollector.start();
		return _this;
	}

	_createClass(LatencyWrapper, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.componentCollector.end();
			this.componentCollector.log();
			if (this.analyticsCallback) {
				this.componentCollector.publishMetrics(this.analyticsCallback);
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			this.componentCollector.start();
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.componentCollector.end();
			this.componentCollector.log();
			if (this.analyticsCallback) {
				this.componentCollector.publishMetrics(this.analyticsCallback);
			}
		}
	}]);

	return LatencyWrapper;
}(_react2.default.Component);

exports.Component = LatencyWrapper;
exports.Collector = _LatencyCollector2.default;
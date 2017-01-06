(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["middlewareDecorator"] = factory();
	else
		root["middlewareDecorator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _synchronousMiddlewareRunner = __webpack_require__(1);
	
	var _synchronousMiddlewareRunner2 = _interopRequireDefault(_synchronousMiddlewareRunner);
	
	var _asynchronousMiddlewareRunner = __webpack_require__(2);
	
	var _asynchronousMiddlewareRunner2 = _interopRequireDefault(_asynchronousMiddlewareRunner);
	
	var _promisedMiddlewareRunner = __webpack_require__(3);
	
	var _promisedMiddlewareRunner2 = _interopRequireDefault(_promisedMiddlewareRunner);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @typedef {Function} functionMiddleware~use
	 * @param {Function} middleware
	 */
	
	/**
	 * @typedef {Function} functionMiddleware
	 * @property {functionMiddleware~use} use
	 */
	
	/**
	 * Generates middleware runner decorators with the given middlewareRunner
	 * @param {Function} middlewareRunner
	 * @returns {middlewareRunner}
	 */
	function middlewareDecoratorFactory(middlewareRunner) {
	  /**
	   * Decorates the given function with middleware functionality
	   * @param {Function} f
	   * @returns {functionMiddleware}
	   */
	  return function middlewareDecorator(f) {
	    function decoratedF() {
	      var _decoratedF$_middlewa;
	
	      return (_decoratedF$_middlewa = decoratedF._middleware).run.apply(_decoratedF$_middlewa, arguments);
	    }
	
	    decoratedF._middleware = new middlewareRunner(f);
	
	    decoratedF.use = function (middleware) {
	      decoratedF._middleware.use(middleware);
	    };
	
	    decoratedF.has = function (middleware) {
	      return decoratedF._middleware.has(middleware);
	    };
	
	    return decoratedF;
	  };
	} /**
	   * Created on 11/12/16.
	   * @author Joel Hernandez <involvmnt@gmail.com>
	   */
	
	var middlewareDecorator = middlewareDecoratorFactory(_synchronousMiddlewareRunner2.default);
	middlewareDecorator.async = middlewareDecoratorFactory(_asynchronousMiddlewareRunner2.default);
	middlewareDecorator.promised = middlewareDecoratorFactory(_promisedMiddlewareRunner2.default);
	
	module.exports = middlewareDecorator;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SynchronousMiddlewareRunner = function () {
	    function SynchronousMiddlewareRunner(f) {
	        _classCallCheck(this, SynchronousMiddlewareRunner);
	
	        this._middlewares = [];
	        this._f = f;
	    }
	
	    _createClass(SynchronousMiddlewareRunner, [{
	        key: "_digest",
	        value: function _digest(middlewares, input) {
	            if (middlewares.length === 0) return input;
	            var nextMiddleware = middlewares.shift();
	            var nextMiddlewareOutput = nextMiddleware(input);
	            return this._digest(middlewares, nextMiddlewareOutput);
	        }
	    }, {
	        key: "use",
	        value: function use(middleware) {
	            if (typeof middleware !== "function") throw new Error('middleware:function is required');
	            this._middlewares.push(middleware);
	        }
	    }, {
	        key: "has",
	        value: function has(middleware) {
	            return this._middlewares.indexOf(middleware) != -1;
	        }
	    }, {
	        key: "_runFWithArgs",
	        value: function _runFWithArgs() {
	            return this._f.apply(this, arguments);
	        }
	    }, {
	        key: "run",
	        value: function run() {
	            var fOutput = this._runFWithArgs.apply(this, arguments);
	            if (this._middlewares.length === 0) return fOutput;
	            return this._digest(this._middlewares.slice(), fOutput);
	        }
	    }]);
	
	    return SynchronousMiddlewareRunner;
	}();
	
	exports.default = SynchronousMiddlewareRunner;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _synchronousMiddlewareRunner = __webpack_require__(1);
	
	var _synchronousMiddlewareRunner2 = _interopRequireDefault(_synchronousMiddlewareRunner);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created on 11/12/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Joel Hernandez <involvmnt@gmail.com>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var AsynchronousMiddlewareRunner = function (_SynchronousMiddlewar) {
	    _inherits(AsynchronousMiddlewareRunner, _SynchronousMiddlewar);
	
	    function AsynchronousMiddlewareRunner() {
	        _classCallCheck(this, AsynchronousMiddlewareRunner);
	
	        return _possibleConstructorReturn(this, (AsynchronousMiddlewareRunner.__proto__ || Object.getPrototypeOf(AsynchronousMiddlewareRunner)).apply(this, arguments));
	    }
	
	    _createClass(AsynchronousMiddlewareRunner, [{
	        key: '_digest',
	        value: function _digest(middlewares, input, onDigested) {
	            if (middlewares.length === 0) return onDigested(undefined, input);
	            var nextMiddleware = middlewares.shift();
	
	            var that = this;
	
	            function next(nextMiddlewareOutput) {
	                if (nextMiddlewareOutput instanceof Error) {
	                    onDigested(nextMiddlewareOutput);
	                } else {
	                    that._digest(middlewares, nextMiddlewareOutput, onDigested);
	                }
	            }
	
	            nextMiddleware(input, next);
	        }
	    }, {
	        key: 'run',
	        value: function run() {
	            var fOutput = this._runFWithArgs.apply(this, arguments);
	            var digestionOutput = void 0;
	            var _cb2 = void 0;
	
	            function runCb() {
	                if (digestionOutput && _cb2) _cb2.apply(undefined, _toConsumableArray(digestionOutput));
	            }
	
	            function onDigested() {
	                for (var _len = arguments.length, output = Array(_len), _key = 0; _key < _len; _key++) {
	                    output[_key] = arguments[_key];
	                }
	
	                digestionOutput = output;
	                runCb();
	            }
	
	            this._digest(this._middlewares.slice(), fOutput, onDigested);
	            return {
	                cb: function cb(_cb) {
	                    if (typeof _cb !== "function") throw new Error('_cb:function is required');
	                    _cb2 = _cb;
	                    runCb();
	                }
	            };
	        }
	    }]);
	
	    return AsynchronousMiddlewareRunner;
	}(_synchronousMiddlewareRunner2.default);
	
	exports.default = AsynchronousMiddlewareRunner;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _synchronousMiddlewareRunner = __webpack_require__(1);
	
	var _synchronousMiddlewareRunner2 = _interopRequireDefault(_synchronousMiddlewareRunner);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created on 11/12/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Joel Hernandez <involvmnt@gmail.com>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var PromisedMiddlewareRunner = function (_FunctionMiddleware) {
	    _inherits(PromisedMiddlewareRunner, _FunctionMiddleware);
	
	    function PromisedMiddlewareRunner() {
	        _classCallCheck(this, PromisedMiddlewareRunner);
	
	        return _possibleConstructorReturn(this, (PromisedMiddlewareRunner.__proto__ || Object.getPrototypeOf(PromisedMiddlewareRunner)).apply(this, arguments));
	    }
	
	    _createClass(PromisedMiddlewareRunner, [{
	        key: '_isPromise',
	
	
	        /**
	         * Checks if the given value is a promise
	         * @param {Object} value
	         * @returns {boolean}
	         * @private
	         */
	        value: function _isPromise(value) {
	            return typeof value.then === 'function';
	        }
	    }, {
	        key: '_digest',
	        value: function _digest(middlewares, input) {
	            var _this2 = this;
	
	            if (middlewares.length === 0) return input;
	            var nextMiddleware = middlewares.shift();
	            var nextMiddlewareOutput = nextMiddleware(input);
	
	            if (this._isPromise(nextMiddlewareOutput)) {
	                return nextMiddlewareOutput.then(function (nextMiddlewareResolution) {
	                    return _this2._digest(middlewares, nextMiddlewareResolution);
	                });
	            }
	            return this._digest(middlewares, nextMiddlewareOutput);
	        }
	
	        /**
	         * @param args
	         * @returns {Promise}
	         */
	
	    }, {
	        key: 'run',
	        value: function run() {
	            var _this3 = this;
	
	            /**
	             * @type {Promise}
	             */
	            var fOutput = this._runFWithArgs.apply(this, arguments);
	            if (this._middlewares.length === 0) return fOutput;
	            return fOutput.then(function (fResolution) {
	                return _this3._digest(_this3._middlewares.slice(), fResolution);
	            });
	        }
	    }]);
	
	    return PromisedMiddlewareRunner;
	}(_synchronousMiddlewareRunner2.default);
	
	exports.default = PromisedMiddlewareRunner;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=middleware-decorator.js.map
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["functionMiddlewareDecorator"] = factory();
	else
		root["functionMiddlewareDecorator"] = factory();
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
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FunctionMiddleware = function () {
	    function FunctionMiddleware(f) {
	        _classCallCheck(this, FunctionMiddleware);
	
	        this._middlewares = [];
	        this._f = f;
	    }
	
	    _createClass(FunctionMiddleware, [{
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
	        key: "run",
	        value: function run() {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }
	
	            var fOutput = this._f.apply(this, arguments);
	            if (this._middlewares.length === 0) return fOutput;
	            return this._digest(this._middlewares.slice(), fOutput);
	        }
	    }]);
	
	    return FunctionMiddleware;
	}();
	
	/**
	 * @typedef {Function} functionMiddleware~use
	 * @param {Function} middleware
	 */
	
	/**
	 * @typedef {Function} functionMiddleware
	 * @property {functionMiddleware~use} use
	 */
	
	/**
	 * Decorates the given function with middleware functionality
	 * @param {Function} f
	 * @returns {functionMiddleware}
	 */
	
	
	function functionMiddlewareDecorator(f) {
	    function decoratedF() {
	        var _decoratedF$_middlewa;
	
	        return (_decoratedF$_middlewa = decoratedF._middleware).run.apply(_decoratedF$_middlewa, arguments);
	    }
	
	    decoratedF._middleware = new FunctionMiddleware(f);
	
	    decoratedF.use = function (middleware) {
	        decoratedF._middleware.use(middleware);
	    };
	
	    return decoratedF;
	}
	
	module.exports = functionMiddlewareDecorator;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=function-middleware-decorator.js.map
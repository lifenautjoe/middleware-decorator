/**
 * Created on 11/12/16.
 * @author Joel Hernandez <joel.hernandez@kpn.com>
 */
import FunctionMiddleware from './synchronous-middleware-runner';

export default class PromisedMiddlewareRunner extends FunctionMiddleware {

    /**
     * Checks if the given value is a promise
     * @param {Object} value
     * @returns {boolean}
     * @private
     */
    _isPromise(value) {
        return typeof value.then === 'function';
    }

    _digest(middlewares, input) {
        if (middlewares.length === 0) return input;
        const nextMiddleware = middlewares.shift();
        const nextMiddlewareOutput = nextMiddleware(input);

        if (this._isPromise(nextMiddlewareOutput)) {
            return nextMiddlewareOutput.then((nextMiddlewareResolution) => {
                return this._digest(middlewares, nextMiddlewareResolution);
            });
        }
        return this._digest(middlewares, nextMiddlewareOutput);
    }

    /**
     * @param args
     * @returns {Promise}
     */
    run(...args) {
        /**
         * @type {Promise}
         */
        const fOutput = this._runFWithArgs(...args);
        if (this._middlewares.length === 0) return fOutput;
        return fOutput.then((fResolution) => {
            return this._digest(this._middlewares.slice(), fResolution)
        });
    }
}

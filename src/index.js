/**
 * Created on 11/12/16.
 * @author Joel Hernandez <joel.hernandez@kpn.com>
 */

import SynchronousMiddlewareRunner from './synchronous-middleware-runner';
import AsynchronousMiddlewareRunner from './asynchronous-middleware-runner';
import PromisedMiddlewareRunner from './promised-middleware-runner';

/**
 * @typedef {Function} functionMiddleware~use
 * @param {Function} middleware
 */

/**
 * @typedef {Function} functionMiddleware
 * @property {functionMiddleware~use} use
 */


/**
 * Generates function middleware decorators with the given middleware
 * @param {Function} middleware
 * @returns {middlewareRunner}
 */
function middlewareRunnerFactory(middleware) {
    /**
     * Decorates the given function with middleware functionality
     * @param {Function} f
     * @returns {functionMiddleware}
     */
    return function middlewareRunner(f) {
        function decoratedF() {
            return decoratedF._middleware.run(...arguments);
        }

        decoratedF._middleware = new middleware(f);

        decoratedF.use = function (middleware) {
            decoratedF._middleware.use(middleware)
        };

        return decoratedF;
    }
}

const middlewareRunner = middlewareRunnerFactory(SynchronousMiddlewareRunner);
middlewareRunner.async = middlewareRunnerFactory(AsynchronousMiddlewareRunner);
middlewareRunner.promised = middlewareRunnerFactory(PromisedMiddlewareRunner);

module.exports = middlewareRunner;

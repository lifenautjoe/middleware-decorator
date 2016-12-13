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
            return decoratedF._middleware.run(...arguments);
        }

        decoratedF._middleware = new middlewareRunner(f);

        decoratedF.use = function (middleware) {
            decoratedF._middleware.use(middleware)
        };

        return decoratedF;
    }
}

const middlewareDecorator = middlewareDecoratorFactory(SynchronousMiddlewareRunner);
middlewareDecorator.async = middlewareDecoratorFactory(AsynchronousMiddlewareRunner);
middlewareDecorator.promised = middlewareDecoratorFactory(PromisedMiddlewareRunner);

module.exports = middlewareDecorator;

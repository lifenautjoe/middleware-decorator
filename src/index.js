/**
 * Created on 11/12/16.
 * @author Joel Hernandez <joel.hernandez@kpn.com>
 */

import FunctionMiddleware from './function-middleware';
import AsyncFunctionMiddleware from './async-function-middleware';
import PromisedFunctionMiddleware from './promised-function-middleware';

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
 * @returns {functionMiddlewareDecorator}
 */
function functionMiddlewareDecoratorFactory(middleware) {
    /**
     * Decorates the given function with middleware functionality
     * @param {Function} f
     * @returns {functionMiddleware}
     */
    return function functionMiddlewareDecorator(f) {
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

const functionMiddlewareDecorator = functionMiddlewareDecoratorFactory(FunctionMiddleware);
functionMiddlewareDecorator.async = functionMiddlewareDecoratorFactory(AsyncFunctionMiddleware);
functionMiddlewareDecorator.promised = functionMiddlewareDecoratorFactory(PromisedFunctionMiddleware);

module.exports = functionMiddlewareDecorator;

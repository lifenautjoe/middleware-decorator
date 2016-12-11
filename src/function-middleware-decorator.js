class FunctionMiddleware {

    constructor(f) {
        this._middlewares = [];
        this._f = f;
    }

    _digest(middlewares, input) {
        if (middlewares.length === 0) return input;
        const nextMiddleware = middlewares.shift();
        const nextMiddlewareOutput = nextMiddleware(input);
        return this._digest(middlewares, nextMiddlewareOutput);
    }

    use(middleware) {
        if (typeof middleware !== "function") throw new Error('middleware:function is required');
        this._middlewares.push(middleware);
    }

    run(...args) {
        const fOutput = this._f(...arguments);
        if (this._middlewares.length === 0) return fOutput;
        return this._digest(this._middlewares.slice(), fOutput)
    }
}

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
        return decoratedF._middleware.run(...arguments);
    }

    decoratedF._middleware = new FunctionMiddleware(f);

    decoratedF.use = function (middleware) {
        decoratedF._middleware.use(middleware)
    };

    return decoratedF;
}

module.exports = functionMiddlewareDecorator;

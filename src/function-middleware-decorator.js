class FunctionMiddleware {

    constructor(f) {
        this._middlewares = [];
        this._f = f;
    }

    _digest(middlewares, fOutput) {
        if (middlewares.length === 0) return fOutput;
        const nextMiddleware = middlewares.shift();
        const nextMiddlewareResult = nextMiddleware(fOutput);
        return this._digest(middlewares, nextMiddlewareResult);
    }

    use(middleware) {
        if (typeof middleware !== "function") throw new Error('middleware:function is required');
        this._middlewares.push(middleware);
    }

    run(middlewares, ...args) {
        const fOutput = this._f(...arguments);
        if (this._middlewares.length === 0) return fOutput;
        return this._digest(this._middlewares.slice(), fOutput)
    }
}

/**
 * Decorates the given function with middleware functionality
 * @param {Function} f
 * @returns {Function}
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

export default functionMiddlewareDecorator;

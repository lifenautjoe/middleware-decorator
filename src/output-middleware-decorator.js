class OutputMiddleware {

    constructor(f) {
        this._middlewares = [];
        this._f = f;
    }

    _digest(middlewares, fOutput) {
        if (middlewares.length === 0) return args;
        const nextMiddleware = this._middlewares.shift();
        const nextMiddlewareResult = nextMiddleware(fOutput);
        return this._digest(middlewares, nextMiddlewareResult);
    }

    remove(middleware) {
        const index = this._middlewares.indexOf(middleware);
        if (index > -1) this._middlewares.splice(index, 1);
    }

    add(middleware) {
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
function outputMiddlewareDecorator(f) {
    const middleware = new OutputMiddleware(f);

    function decoratedF() {
        return middleware.run(...arguments);
    }

    decoratedF.add = function (middleware) {
        this.middleware.add(middleware)
    };

    decoratedF.remove = function (middleware) {
        this.middleware.remove(middleware)
    };

    return decoratedF;
}

export default outputMiddlewareDecorator;

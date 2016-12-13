export default class SynchronousMiddlewareRunner {

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

    _runFWithArgs(...args) {
        return this._f(...args);
    }

    run(...args) {
        const fOutput = this._runFWithArgs(...args);
        if (this._middlewares.length === 0) return fOutput;
        return this._digest(this._middlewares.slice(), fOutput)
    }
}

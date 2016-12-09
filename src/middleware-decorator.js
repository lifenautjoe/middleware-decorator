class Middleware {

    constructor(f) {
        this._middlewares = [];
        this._f = f;
    }

    run() {

    }
}

function middlewareDecorator(f) {
    const middleware = new Middleware(f);
    return function () {
        return middleware.run(...arguments);
    }
}

export default middlewareDecorator;

/**
 * Created on 11/12/16.
 * @author Joel Hernandez <joel.hernandez@kpn.com>
 */
import FunctionMiddleware from './function-middleware';

export default class AsyncFunctionMiddleware extends FunctionMiddleware {

    _digest(middlewares, input, onDigested) {
        if (middlewares.length === 0) return onDigested(undefined, input);
        const nextMiddleware = middlewares.shift();

        function next(nextMiddlewareOutput) {
            if (nextMiddlewareOutput instanceof Error) {
                onDigested(nextMiddlewareOutput);
            } else {
                this._digest(middlewares, nextMiddlewareOutput, onDigested);
            }
        }

        nextMiddleware(input, next);
    }

    run(...args) {
        const fOutput = this._runFWithArgs(...args);
        if (this._middlewares.length === 0) return fOutput;
        let digestionOutput;
        let cb;

        function runCb() {
            if (digestionOutput && cb) cb(digestionOutput);
        }

        function onDigested(_digestionOutput) {
            digestionOutput = _digestionOutput;
            runCb();
        }

        this._digest(this._middlewares.slice(), fOutput, onDigested);
        return {
            cb: function (_cb) {
                if (typeof _cb !== "function") throw new Error('_cb:function is required');
                cb = _cb;
                runCb();
            }
        }
    }
}

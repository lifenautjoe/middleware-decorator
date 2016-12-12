/**
 * Created on 11/12/16.
 * @author Joel Hernandez <joel.hernandez@kpn.com>
 */
import FunctionMiddleware from './function-middleware';

export default class AsyncFunctionMiddleware extends FunctionMiddleware {

    _digest(middlewares, input, onDigested) {
        if (middlewares.length === 0) return onDigested(undefined, input);
        const nextMiddleware = middlewares.shift();

        const that = this;

        function next(nextMiddlewareOutput) {
            if (nextMiddlewareOutput instanceof Error) {
                onDigested(nextMiddlewareOutput);
            } else {
                that._digest(middlewares, nextMiddlewareOutput, onDigested);
            }
        }

        nextMiddleware(input, next);
    }

    run(...args) {
        const fOutput = this._runFWithArgs(...args);
        let digestionOutput;
        let cb;

        function runCb() {
            if (digestionOutput && cb) cb(...digestionOutput);
        }

        function onDigested(...output) {
            digestionOutput = output;
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

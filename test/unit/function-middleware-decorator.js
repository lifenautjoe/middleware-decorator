import functionMiddlewareDecorator from '../../src';

const expect = chai.expect;

describe('functionMiddlewareDecorator', () => {

    const middlewaresTestCount = 10;
    let originalOutput;
    let originalFunction;

    beforeEach(() => {
        originalOutput = {
            count: middlewaresTestCount
        };
        originalFunction = spy(() => {
            return originalOutput
        });
    });

    describe('(f)', () => {

        let decoratedFunction;

        beforeEach(() => {
            decoratedFunction = functionMiddlewareDecorator(originalFunction);
        });

        describe('#use', () => {

            const badMiddlwareErrorMessage = 'middleware:function is required';

            it('should be a function', () => {
                expect(decoratedFunction.use).to.be.a('function');
            });

            describe('when no middleware is passed', () => {
                it('should throw an error', () => {
                    expect(() => {
                        decoratedFunction.use();
                    }).to.throw(badMiddlwareErrorMessage);
                });
            });

            describe('when middleware is passed', () => {
                describe('when middleware is not a function', () => {

                    const invalidMiddlewares = [
                        1, 'what', false, null
                    ];

                    it('should throw an error', () => {
                        invalidMiddlewares.forEach((badMiddleware) => {
                            expect(() => {
                                decoratedFunction.use(badMiddleware);
                            }).to.throw(badMiddlwareErrorMessage);
                        });
                    });
                });

                describe('when middleware is a function', () => {
                    function validMiddleware() {

                    }

                    it('should add it to the instance middlewares array', () => {
                        decoratedFunction.use(validMiddleware);
                        expect(decoratedFunction._middleware._middlewares).to.contain(validMiddleware);
                    });
                });
            })
        });

        describe('()', () => {

            it('should forward all arguments to the original function', () => {
                const args = [123, 'string', false, null];
                decoratedFunction(...args);
                expect(originalFunction.calledOnce).to.be.true;
                expect(originalFunction.calledWith(...args)).to.be.true;
            });

            describe('when no middlewares have been added', () => {
                it('should return the original function output', () => {
                    expect(decoratedFunction()).to.equal(originalOutput);
                });
            });

            describe('when middlewares have been added', () => {

                let middlewares;

                beforeEach(() => {
                    middlewares = [];
                    for (let i = 0; i < middlewaresTestCount; i++) {
                        middlewares.push((output) => {
                            output.count--;
                            return output;
                        });
                    }
                });

                it('should pass the original output through all of the middlewares while making the output of one the input for the next one', () => {
                    middlewares.forEach((middleware) => {
                        decoratedFunction.use(middleware);
                    });
                    const output = decoratedFunction();
                    expect(output).to.equal(originalOutput);
                    expect(output.count).to.equal(0);
                });
            });
        });
    });

    describe('#async(f)', () => {

        let decoratedFunction;

        beforeEach(() => {
            decoratedFunction = functionMiddlewareDecorator.async(originalFunction);
        });

        describe('#use(middleware)', () => {

            const badMiddlwareErrorMessage = 'middleware:function is required';

            it('should be a function', () => {
                expect(decoratedFunction.use).to.be.a('function');
            });

            describe('when no middleware is passed', () => {
                it('should throw an error', () => {
                    expect(() => {
                        decoratedFunction.use();
                    }).to.throw(badMiddlwareErrorMessage);
                });
            });

            describe('when middleware is passed', () => {
                describe('when middleware is not a function', () => {

                    const invalidMiddlewares = [
                        1, 'what', false, null
                    ];

                    it('should throw an error', () => {
                        invalidMiddlewares.forEach((badMiddleware) => {
                            expect(() => {
                                decoratedFunction.use(badMiddleware);
                            }).to.throw(badMiddlwareErrorMessage);
                        });
                    });
                });

                describe('when middleware is a function', () => {
                    function validMiddleware() {

                    }

                    it('should add it to the instance middlewares array', () => {
                        decoratedFunction.use(validMiddleware);
                        expect(decoratedFunction._middleware._middlewares).to.contain(validMiddleware);
                    });
                });
            })
        });

        describe('()', () => {

            describe('#cb(callback)', () => {

                const badMiddlwareErrorMessage = '_cb:function is required';

                it('should be a function', () => {
                    expect(decoratedFunction().cb).to.be.a('function');
                });

                describe('when no callback is passed', () => {
                    it('should throw an error', () => {
                        expect(() => {
                            decoratedFunction().cb();
                        }).to.throw(badMiddlwareErrorMessage);
                    });
                });

                describe('when callback is passed', () => {
                    describe('when callback is not a function', () => {

                        const invalidMiddlewares = [
                            1, 'what', false, null
                        ];

                        it('should throw an error', () => {
                            invalidMiddlewares.forEach((badMiddleware) => {
                                expect(() => {
                                    decoratedFunction().cb(badMiddleware);
                                }).to.throw(badMiddlwareErrorMessage);
                            });
                        });
                    });

                    describe('when callback is a function', () => {

                        let validCallback;

                        beforeEach(() => {
                            validCallback = spy(() => {

                            });
                        });

                        describe('when no middlewares have been added', () => {
                            it('should call the callback with the original value', () => {
                                decoratedFunction().cb(validCallback);
                                expect(validCallback.calledOnce).to.be.true;
                                expect(validCallback.calledWith(undefined, originalOutput)).to.be.true;
                            });
                        });


                        describe('when middlewares have been added', () => {

                            let middlewares;

                            beforeEach(() => {
                                middlewares = [];
                                for (let i = 0; i < middlewaresTestCount; i++) {
                                    middlewares.push((output, next) => {
                                        output.count--;
                                        next(output);
                                    });
                                }
                            });

                            describe('when a middleware passes an error to next()', () => {
                                it('should call the callback with the error as first argument', (done) => {
                                    const error = new Error();
                                    middlewares.unshift((output, next) => {
                                        next(error);
                                    });
                                    middlewares.forEach((middleware) => {
                                        decoratedFunction.use(middleware);
                                    });
                                    decoratedFunction().cb((err, output) => {
                                        expect(err).to.equal(error);
                                        expect(output).to.be.undefined;
                                        // Should have stopped the other middlewares from modifying it
                                        expect(originalOutput.count).to.equal(middlewaresTestCount);
                                        done();
                                    });
                                })
                            });

                            describe('when no middleware passes an error to next()', () => {
                                it(`should pass the original output through all of the middlewares by calling done() hence making the 
                            output of one the input for the next one and finally call the given callback with the output`, (done) => {
                                    middlewares.forEach((middleware) => {
                                        decoratedFunction.use(middleware);
                                    });
                                    decoratedFunction().cb((err, output) => {
                                        expect(err).to.be.undefined;
                                        expect(output).to.equal(originalOutput);
                                        expect(output.count).to.equal(0);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                })
            });

            it('should forward all arguments to the original function', () => {
                const args = [123, 'string', false, null];
                decoratedFunction(...args);
                expect(originalFunction.calledOnce).to.be.true;
                expect(originalFunction.calledWith(...args)).to.be.true;
            });
        });
    });

    describe('#promised(f)', () => {
        let decoratedFunction;
        let promisedFunction;
        let originalPromisedFunctionOutput;
        beforeEach(() => {
            originalPromisedFunctionOutput = new Promise((resolve) => {
                resolve(originalOutput);
            });
            promisedFunction = spy(() => {
                return originalPromisedFunctionOutput;
            });
            decoratedFunction = functionMiddlewareDecorator.promised(promisedFunction);
        });

        describe('#use(middleware)', () => {

            const badMiddlwareErrorMessage = 'middleware:function is required';

            it('should be a function', () => {
                expect(decoratedFunction.use).to.be.a('function');
            });

            describe('when no middleware is passed', () => {
                it('should throw an error', () => {
                    expect(() => {
                        decoratedFunction.use();
                    }).to.throw(badMiddlwareErrorMessage);
                });
            });

            describe('when middleware is passed', () => {
                describe('when middleware is not a function', () => {

                    const invalidMiddlewares = [
                        1, 'what', false, null
                    ];

                    it('should throw an error', () => {
                        invalidMiddlewares.forEach((badMiddleware) => {
                            expect(() => {
                                decoratedFunction.use(badMiddleware);
                            }).to.throw(badMiddlwareErrorMessage);
                        });
                    });
                });

                describe('when middleware is a function', () => {
                    function validMiddleware() {

                    }

                    it('should add it to the instance middlewares array', () => {
                        decoratedFunction.use(validMiddleware);
                        expect(decoratedFunction._middleware._middlewares).to.contain(validMiddleware);
                    });
                });
            })
        });

        describe('()', () => {
            it('should forward all arguments to the original function', () => {
                const args = [123, 'string', false, null];
                decoratedFunction(...args);
                expect(promisedFunction.calledOnce).to.be.true;
                expect(promisedFunction.calledWith(...args)).to.be.true;
            });

            describe('when no middlewares have been added', () => {
                it('should return the original function output', () => {
                    expect(decoratedFunction()).to.equal(originalPromisedFunctionOutput);
                });
            });

            describe('when middlewares have been added', () => {

                let middlewares;

                beforeEach(() => {
                    middlewares = [];
                    let synchronousMiddleware;
                    for (let i = 0; i < middlewaresTestCount; i++) {
                        if (synchronousMiddleware) {
                            // Synchronous middlewares
                            middlewares.push((output) => {
                                output.count--;
                                return output;
                            });
                        } else {
                            // Promised middlewares
                            middlewares.push((output) => {
                                return new Promise((resolve) => {
                                    output.count--;
                                    resolve(output);
                                });
                            });
                        }
                        synchronousMiddleware = !synchronousMiddleware;
                    }
                });

                it('should pass the original output through all of the middlewares (promised and synchronous) while making the output of one the input for the next one', (done) => {
                    middlewares.forEach((middleware) => {
                        decoratedFunction.use(middleware);
                    });
                    decoratedFunction().then((output) => {
                        expect(output).to.equal(originalOutput);
                        expect(output.count).to.equal(0);
                        done();
                    });
                });

                describe('when the function rejects with an error', () => {
                    let decoratedFunction;
                    let rejectedPromisedFunction;
                    let promiseError;
                    beforeEach(() => {
                        promiseError = new Error('Some other error');
                        rejectedPromisedFunction = spy(() => {
                            return new Promise((resolve, reject) => {
                                reject(promiseError);
                            });
                        });
                        decoratedFunction = functionMiddlewareDecorator.promised(rejectedPromisedFunction);
                    });

                    it('should reject with the same error', (done) => {
                        middlewares.forEach((middleware) => {
                            decoratedFunction.use(middleware);
                        });
                        decoratedFunction().catch((err) => {
                            expect(err).to.equal(promiseError);
                            done();
                        });
                    });
                });

                describe('when a promised middleware throws an error', () => {
                    it('should reject with the thrown error', (done) => {
                        const error = new Error('Some error');
                        middlewares.unshift(() => {
                            throw error;
                        });
                        middlewares.forEach((middleware) => {
                            decoratedFunction.use(middleware);
                        });
                        decoratedFunction().catch((err) => {
                            expect(err).to.equal(error);
                            done();
                        });
                    });
                });
            });
        });
    });


});

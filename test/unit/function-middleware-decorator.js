import functionMiddlewareDecorator from '../../src/function-middleware-decorator';

const expect = chai.expect;

describe('functionMiddlewareDecorator', () => {

    const middlewaresTestCount = 10;
    let originalOutput;
    let originalFunction;
    let decoratedFunction;

    beforeEach(() => {
        originalOutput = {
            count: middlewaresTestCount
        };
        originalFunction = spy(() => {
            return originalOutput
        });

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

            let middlewares = [];

            for (let i = 0; i < middlewaresTestCount; i++) {
                middlewares.push((output) => {
                    output.count--;
                    return output;
                });
            }

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

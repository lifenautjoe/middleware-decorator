# middleware-decorator

Decorates functions with middleware super-powers.

[![Travis build status](http://img.shields.io/travis/thefabulousdev/middleware-decorator.svg?style=flat)](https://travis-ci.org/thefabulousdev/middleware-decorator)
[![Code Climate](https://codeclimate.com/github/thefabulousdev/middleware-decorator/badges/gpa.svg)](https://codeclimate.com/github/thefabulousdev/middleware-decorator)
[![Test Coverage](https://codeclimate.com/github/thefabulousdev/middleware-decorator/badges/coverage.svg)](https://codeclimate.com/github/thefabulousdev/middleware-decorator)
[![Dependency Status](https://david-dm.org/thefabulousdev/middleware-decorator.svg)](https://david-dm.org/thefabulousdev/middleware-decorator)
[![devDependency Status](https://david-dm.org/thefabulousdev/middleware-decorator/dev-status.svg)](https://david-dm.org/thefabulousdev/middleware-decorator#info=devDependencies)

## Features

- Synchronous, asynchronous and promised middleware runners
- No dependencies
- UMD Module
- Tiny(5KB)

## Installation

### npm
```sh
    npm install middleware-decorator
```

### bower
```sh
    bower install middleware-decorator
```

## Demo

### Given

The module has been imported with your favorite loader as `middlewareRunner` and the following function is available

```js
function getPrice(){
    return 10;
}
```

### Then

#### Decorate with a synchronous middleware

```js
getPrice = middlewareRunner(getPrice);

function halfPriceMiddleware(price){
    return price / 2;
}

getPrice.use(halfPriceMiddleware);

console.log(getPrice()); // 5

```

#### Decorate with an asynchronous middleware

```js
getPrice = middlewareRunner.async(getPrice);

function halfPriceMiddleware(price, done){
    setTimeout(()=>{
        done(price / 2);
    }, 2000);
}

getPrice.use(halfPriceMiddleware);

getPrice().cb((price)=>{
    console.log(price()); // 5
});

```

#### Decorate with a promised middleware

```js
getPrice = middlewareRunner.promised(getPrice);

// Can return any value, if it's a promise, next middleware won't get executed till resolved
function halfPriceMiddleware(price){
    return hasHalfPriceDiscount().then((hasHalfPriceDiscount)=>{
        return hasHalfPriceDiscount ? price / 2 : price;
    });
}

getPrice.use(halfPriceMiddleware);

getPrice().then((price)=>{
    console.log(price()); // 5
});

```

## API

### Module

#### (originalFunction: Function) : SynchronousMiddlewareRunner

Takes a function as argument and returns a synchronous middleware runner

```js
synchronousMiddlewareRunner = middlewareRunner(originalFunction);
```


#### promised(originalFunction: Function) : PromisedMiddlewareRunner

Takes a function as argument and returns a promised middleware runner

```js
promisedMiddlewareRunner = middlewareRunner(originalFunction);
```

#### async(originalFunction: Function) : AsynchronousMiddlewareRunner

Takes a function as argument and returns an asynchronous middleware runner

```js
asynchronousMiddlewareRunner = middlewareRunner(originalFunction);
```

### synchronousMiddlewareRunner

#### synchronousMiddlewareRunner.use(synchronousMiddleware: Function)

Adds a synchronous middleware

```js
synchronousMiddlewareRunner.use((middlewareOutput) => {
    return middlewareOutput;
});
```

#### synchronousMiddlewareRunner(...args);

Calls the original function with the given arguments and runs it's output through the registered synchronous middleware

```js
synchronousMiddlewareRunner(arg1, arg2);
```

### asynchronousMiddlewareRunner

#### asynchronousMiddlewareRunner.use(asynchronousMiddleware: Function)

Adds an asynchronous middleware

```js
asynchronousMiddlewareRunner.use((middlewareOutput, done) => {
    done(middlewareOutput);
});
```

#### asynchronousMiddlewareRunner(...args).cb(callback: Function);

Calls the original function with the given arguments and runs it's output through the registered middleware, when done, calls the provided callback

```js
asynchronousMiddlewareRunner(arg1, arg2).cb((middlewareOutput)=>{
    console.log(`Done with ${middlewareOutput}`);
});
```

### promisedMiddlewareRunner

#### promisedMiddlewareRunner.use(promisedMiddleware: Function)

Adds a promised middleware

```js
promisedMiddlewareRunner.use((middlewareOutput) => {
    return new Promise((resolve, reject) => {
        resolve(middlewareOutput);
    });
});
```

#### promisedMiddlewareRunner(...args).then(promiseHandler: Function);

Calls the original function with the given arguments and runs it's output through the registered middleware, when done, calls the provided callback

```js
promisedMiddlewareRunner(arg1, arg2).then((middlewareOutput)=>{
    console.log(`Done with ${middlewareOutput}`);
});
```

## Contributing

#### Clone the repository

``` sh
git clone git@github.com:thefabulousdev/middleware-decorator.git
```


#### Install dependencies
``` sh
npm install
```

#### Use npm scripts

- `npm test` - Lint the library and tests, then run the unit tests
- `npm run lint` - Lint the source and unit tests
- `npm run watch` - Continuously run the unit tests as you make changes to the source
   and test files themselves
- `npm run test-browser` - Build the library for use with the browser spec runner.
  Changes to the source will cause the runner to automatically refresh.
- `npm run build` - Lint then build the library
- `npm run coverage` - Generate a coverage report

#### Author: [Joel Hernández](https://github.com/thefabulousdev)

# middleware-decorator

Decorates functions with middleware super-powers.

[![Travis build status](http://img.shields.io/travis/thefabulousdev/middleware-decorator.svg?style=flat)](https://travis-ci.org/thefabulousdev/middleware-decorator)
[![Code Climate](https://codeclimate.com/github/thefabulousdev/middleware-decorator/badges/gpa.svg)](https://codeclimate.com/github/thefabulousdev/middleware-decorator)
[![Test Coverage](https://codeclimate.com/github/thefabulousdev/middleware-decorator/badges/coverage.svg)](https://codeclimate.com/github/thefabulousdev/middleware-decorator)
[![Dependency Status](https://david-dm.org/thefabulousdev/middleware-decorator.svg)](https://david-dm.org/thefabulousdev/middleware-decorator)
[![devDependency Status](https://david-dm.org/thefabulousdev/middleware-decorator/dev-status.svg)](https://david-dm.org/thefabulousdev/middleware-decorator#info=devDependencies)

## Table of contents

* [Features](#features)
* [Installation](#installation)
  + [npm](#npm)
  + [bower](#bower)
* [Sample usage](#sample-usage)
      * [Prerequisites](#prerequisites)
    - [Decorate with a synchronous middleware](#decorate-with-a-synchronous-middleware)
    - [Decorate with an asynchronous middleware](#decorate-with-an-asynchronous-middleware)
    - [Decorate with a promised middleware](#decorate-with-a-promised-middleware)
* [API](#api)
  + [Module](#module)
    - [(anyFunction) : SynchronousMiddlewareRunner](#anyfunction--synchronousmiddlewarerunner)
    - [promised(anyFunction) : PromisedMiddlewareRunner](#promisedanyfunction--promisedmiddlewarerunner)
    - [async(anyFunction) : AsynchronousMiddlewareRunner](#asyncanyfunction--asynchronousmiddlewarerunner)
  + [SynchronousMiddlewareRunner](#synchronousmiddlewarerunner)
    - [synchronousMiddlewareRunner.use(synchronousMiddleware: Function)](#synchronousmiddlewarerunnerusesynchronousmiddleware-function)
    - [synchronousMiddlewareRunner(...args);](#synchronousmiddlewarerunnerargs)
  + [AsynchronousMiddlewareRunner](#asynchronousmiddlewarerunner)
    - [asynchronousMiddlewareRunner.use(asynchronousMiddleware: Function)](#asynchronousmiddlewarerunneruseasynchronousmiddleware-function)
    - [asynchronousMiddlewareRunner(...args).cb(callback: Function);](#asynchronousmiddlewarerunnerargscbcallback-function)
  + [PromisedMiddlewareRunner](#promisedmiddlewarerunner)
    - [promisedMiddlewareRunner.use(promisedMiddleware: Function)](#promisedmiddlewarerunnerusepromisedmiddleware-function)
    - [promisedMiddlewareRunner(...args).then(promiseHandler: Function);](#promisedmiddlewarerunnerargsthenpromisehandler-function)
* [Contributing](#contributing)
    - [Clone the repository](#clone-the-repository)
    - [Install dependencies](#install-dependencies)
    - [Use npm scripts](#use-npm-scripts)

## Features

- Synchronous, asynchronous and promised middleware support
- Zero dependencies
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

## Sample usage

#### Prerequisites

The module has been imported with your favorite loader as `middlewareDecorator` and the following function is available

```js
function getPrice(){
    return 10;
}
```

#### Decorate with a synchronous middleware runner

```js
getPrice = middlewareDecorator(getPrice);

function halfPriceMiddleware(price){
    return price / 2;
}

getPrice.use(halfPriceMiddleware);

console.log(getPrice()); // 5

```

#### Decorate with an asynchronous middleware runner

```js
getPrice = middlewareDecorator.async(getPrice);

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

#### Decorate with a promised middleware runner

```js
getPrice = middlewareDecorator.promised(getPrice);

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

#### (anyFunction) : SynchronousMiddlewareRunner

Takes a function as argument and returns a synchronous middleware runner

```js
synchronousMiddlewareRunner = middlewareDecorator(anyFunction);
```


#### promised(anyFunction) : PromisedMiddlewareRunner

Takes a function as argument and returns a promised middleware runner

```js
promisedMiddlewareRunner = middlewareDecorator(anyFunction);
```

#### async(anyFunction) : AsynchronousMiddlewareRunner

Takes a function as argument and returns an asynchronous middleware runner

```js
asynchronousMiddlewareRunner = middlewareDecorator(anyFunction);
```

### SynchronousMiddlewareRunner

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

### AsynchronousMiddlewareRunner

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

### PromisedMiddlewareRunner

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

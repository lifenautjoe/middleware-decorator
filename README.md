# function-middleware-decorator

Decorates functions with middleware functionality

[![Travis build status](http://img.shields.io/travis/thefabulousdev/function-middleware-decorator.svg?style=flat)](https://travis-ci.org/thefabulousdev/function-middleware-decorator)
[![Code Climate](https://codeclimate.com/github/thefabulousdev/function-middleware-decorator/badges/gpa.svg)](https://codeclimate.com/github/thefabulousdev/function-middleware-decorator)
[![Test Coverage](https://codeclimate.com/github/thefabulousdev/function-middleware-decorator/badges/coverage.svg)](https://codeclimate.com/github/thefabulousdev/function-middleware-decorator)
[![Dependency Status](https://david-dm.org/thefabulousdev/function-middleware-decorator.svg)](https://david-dm.org/thefabulousdev/function-middleware-decorator)
[![devDependency Status](https://david-dm.org/thefabulousdev/function-middleware-decorator/dev-status.svg)](https://david-dm.org/thefabulousdev/function-middleware-decorator#info=devDependencies)

## Installation

### npm
```sh
    npm install function-middleware-decorator
```

### bower
```sh
    bower install function-middleware-decorator
```

## Usage

Given that the module has been imported with your favorite loader as `functionMiddlewareDecorator`

```js
function getPrice(){
    return 10;
}

getPrice = functionMiddlewareDecorator(getPrice);

function halfPriceMiddleware(price){
    return price / 2;
}

getPrice.use(halfPriceMiddleware);

// totalPrice = 5
const price = getPrice();

```

## Contributing

#### Clone the repository

``` sh
git clone git@github.com:thefabulousdev/function-middleware-decorator.git
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

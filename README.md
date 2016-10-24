# karma-tap-pretty-reporter

[![npm version](https://badge.fury.io/js/karma-tap-pretty-reporter.svg)](https://badge.fury.io/js/karma-tap-pretty-reporter)
[![npm downloads](https://img.shields.io/npm/dm/karma-tap-pretty-reporter.svg?style=flat-square)](https://www.npmjs.com/package/karma-tap-pretty-reporter)
[![Build Status](https://travis-ci.org/bySabi/karma-tap-pretty-reporter.svg?branch=master)](https://travis-ci.org/bySabi/karma-tap-pretty-reporter)
[![Windows Tests](https://img.shields.io/appveyor/ci/bySabi/karma-tap-pretty-reporter/master.svg?label=Windows%20Tests)](https://ci.appveyor.com/project/bySabi/karma-tap-pretty-reporter)
[![bitHound Overall Score](https://www.bithound.io/github/bySabi/karma-tap-pretty-reporter/badges/score.svg)](https://www.bithound.io/github/bySabi/karma-tap-pretty-reporter)

> a Karma reporter plugin for `report` and `prettify` TAP test results


## Installation

### npm
```bash
npm install karma karma-tap karma-tap-pretty-reporter --save-dev
```

### [optional] install a `prettify` package. See below supported prettifiers
```bash
npm install faucet --save-dev
```

## Usage

Add `karma.conf.js` file to project.

Example:
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['tap-pretty'],

    tapReporter: {
      prettify: require('faucet'), // default 'standard TAP' output
      separator: '****************************'
    },
  });
};
```

### Using `separator`
On Karma `autoWatch` mode maybe we need separate test run cycles output. Create a `separator` string for this purpose.
> In order of not pollute output, `separator` will be shown only if LogLevel is different of `LOG_INFO` nor `LOG_DEBUG`

### Report to a file
Optionally you can save report to a file and turn off output to the console.

```js
// karma.conf.js

reporters: ['tap-pretty'],

tapReporter: {
  outputFile: './test.out.tap',
  disableStdout: true            // default 'false'
},

```

## Supported `prettifiers`
* [faucet](https://github.com/substack/faucet)
* [tap-spec](https://github.com/scottcorgan/tap-spec)
* [tap-min](https://github.com/gummesson/tap-min)
* [tap-diff](https://github.com/axross/tap-diff)
* [tap-notify](https://github.com/axross/tap-notify)
* [tap-summary](https://github.com/zoubin/tap-summary)
* [tap-markdown](https://github.com/Hypercubed/tap-markdown)
* [tap-difflet](https://github.com/namuol/tap-difflet)

## Use Cases

### Show only 'failed' test
Install `tap-difflet` package
```bash
npm install tap-difflet --save-dev
```
Add settings to `tapReporter` on karma.conf.js
```js
tapReporter: {
      // outputFile: './unit.tap',
      prettify: function() { return require('tap-difflet')({ pessimistic: true }); },
      separator: '****************************',
    },
```

## Example
- [karma-tap-pretty-reporter--example](https://github.com/bySabi/karma-tap-pretty-reporter/tree/example)

## Credits

### author
* bySabi Files <> [@bySabi](https://github.com/bySabi)

### contributors
* Rostyslav Diachok <> [@infernalmaster](https://github.com/infernalmaster)

## Contributing
* Documentation improvement
* Feel free to send any PR

## License

[ISC][isc-license]

[isc-license]:./LICENSE

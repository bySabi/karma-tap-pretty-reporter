var stream = require('stream');
var path = require('path');
var fs = require('fs');
var EOL = require('os').EOL;

var TAPReporter = function (baseReporterDecorator, rootConfig, logger, helper) {
  var log = logger.create('karma-tap-pretty-reporter');
  var config = rootConfig.tapReporter || {};
  var disableStdout = config.disableStdout === true;
  var outputFile = config.outputFile && path.resolve(rootConfig.basePath, config.outputFile);
  var logLevel = rootConfig.logLevel;
  // don´t pollute output
  // show 'separator' if logLevel is not LOG_INFO nor LOG_DEBUG
  var separator = logLevel !== 'INFO' && logLevel !== 'DEBUG' ? config.separator : '';
  var prettify;
  if (config.prettify && typeof config.prettify !== 'function') {
    log.warn('prettify option is not a function');
    prettify = null;
  } else {
    prettify = config.prettify;
  }

  var firstRun = true;
  var out; // ouput stream
  var numbers, output, currentSuite; // working vars

  baseReporterDecorator(this);

  this.onRunStart = function() {
    numbers = {};
    output = '';
    currentSuite = '';

    if (!disableStdout) {
      out = new stream.Readable();
      out._read = function() {}

      if (prettify) {
        out.pipe(prettify()).pipe(process.stdout);
      } else {
        out.pipe(process.stdout);
      }

      // output 'separator' per test execution with autoWatch mode on
      if (separator && !firstRun) {
        this.write(separator + EOL);
      }
    }

    write('TAP version 13' + EOL);
    firstRun = false;
  }

  this.onBrowserStart = function(browser) {
    numbers[browser.id] = 0;
  }

  this.specSuccess = function(browser, result) {
    writeSuite(result.suite);
    write('ok ' + ++numbers[browser.id] + ' ' + result.description + EOL);
  }

  this.specFailure = function(browser, result) {
    var resultLog = JSON.parse(result.log[0]);
    writeSuite(result.suite);
    write('not ok ' + ++numbers[browser.id] + ' ' + result.description + EOL);
    write('  ---' + EOL);
    for (var key in resultLog) {
      write('    ' + key + ': ' + resultLog[key] + EOL);
    }
    write('  ...' + EOL);
  }

  this.specSkipped = function(browser, result) {
    write('# SKIP' + ' ' + result.description);
  }

  this.onRunComplete = function(browsers, results) {
    var total = 0;
    var success = 0;
    var failed = 0;
    browsers.forEach(function(browser, id) {
      total += browser.lastResult.total;
      success += browser.lastResult.success;
      failed += browser.lastResult.failed;
    });

    write(EOL);
    write('1..' + total + EOL);
    write('# tests ' + total + EOL);
    write('# pass  ' + success + EOL);
    if (failed) {
      write('# fail  ' + failed + EOL);
    }
    write(EOL);
    if (!failed) {
      write('# ok' + EOL);
    }
    write(EOL);

    if (!disableStdout) {
      // close stream
      out.push(null);
    }

    if (outputFile) {
      helper.mkdirIfNotExists(path.dirname(outputFile), function (err) {
        if (err) {
          return log.error('error writing report to file: ' + err);
        }
        log.info('writing report to file: ' + outputFile);
        fs.writeFileSync(outputFile, output);
      });
    }
  }

  function write(data) {
    output = output + data;
    if (!disableStdout) {
      out.push(data);
    }
  }

  function writeSuite(suite) {
    suite = suite.join(' ').replace(/\./g, '_');
    if (currentSuite !== suite) {
      write(suite);
      currentSuite = suite;
    }
  }
}

TAPReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper'];

module.exports = {
  'reporter:tap-pretty': ['type', TAPReporter]
};

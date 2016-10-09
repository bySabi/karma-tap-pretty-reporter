var stream = require('stream');
var path = require('path');
var fs = require('fs');
var EOL = require('os').EOL;

var TAPReporter = function (baseReporterDecorator, config, logger, helper) {
  var reporterConfig = config.tapReporter || {};
  var log = logger.create('karma-tap-pretty-reporter');
  var out;
  var output;
  var numbers;
  var outputFile;
  var currentSuite;

  /**
   * save all data that is coming in to the `data` variable for later use and
   * proxy input to `this.write`
   */
  function write(data) {
    output = output + data;
    if (!reporterConfig.disableStdout) {
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

  if (reporterConfig.outputFile) {
    outputFile = path.resolve(config.basePath, reporterConfig.outputFile)
  }

  baseReporterDecorator(this);

  this.onRunStart = function() {
    numbers = {};
    output = '';
    currentSuite = '';

    if (!reporterConfig.disableStdout) {
      out = new stream.Readable();
      out._read = function () { };

      if (reporterConfig.prettify) out.pipe(reporterConfig.prettify());
      out.pipe(process.stdout);

      // output Test `session` separator
      if (reporterConfig.separator) console.log(reporterConfig.separator);
    }

    write('TAP version 13' + EOL);
  };

  this.onBrowserStart = function(browser) {
    numbers[browser.id] = 0;
  };

  this.specSuccess = function(browser, result) {
    writeSuite(result.suite);
    write('ok ' + ++numbers[browser.id] + ' ' + result.description + EOL);
  };

  this.specFailure = function(browser, result) {
    var resultLog = JSON.parse(result.log[0]);
    writeSuite(result.suite);
    write('not ok ' + ++numbers[browser.id] + ' ' + result.description + EOL);
    write('  ---' + EOL);
    for (var key in resultLog) {
      write('    ' + key + ': ' + resultLog[key] + EOL);
    }
    write('  ...' + EOL);
  };

  this.specSkipped = function(browser, result) {
    write('# SKIP' + ' ' + result.description);
  };

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

    if (!reporterConfig.disableStdout) {
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
  };
};

TAPReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper'];

module.exports = {
  'reporter:tap-pretty': ['type', TAPReporter]
};

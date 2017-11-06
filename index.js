var fs = require('fs');
var uuid = require('uuidv4');
/**
 * Module dependencies.
 */

var Base, log

if (typeof window === 'undefined') {
  // running in Node
  Base = require('mocha').reporters.Base
  log = console.log
} else if(window.Mocha && window.Mocha.reporters && window.Mocha.reporters.Base) {
  // running in browser (possibly phantomjs) but without require
  Base = window.Mocha.reporters.Base
  log = console.log
} else {
  // running in mocha-phantomjs
  Base = require('./base')
  log = function(msg) { process.stdout.write(msg + '\n') }
}

/**
 * Expose `Teamcity`.
 */

if (typeof window !== 'undefined' && window.Mocha && window.Mocha.reporters) {
  window.Mocha.reporters.NightwatchIstanbul = NightwatchIstanbul
}else{
  exports = module.exports = NightwatchIstanbul
}

/**
 * Initialize a new `Nightwatch+Mocha istanbul` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function NightwatchIstanbul(runner) {
  Base.call(this, runner)

  runner.on('test end', function(test) {
    console.log(test.title + '\n');

    var client = this.test.ctx._runnable._nightwatch['@client'];

    client.api.execute(function() {
      return window.__coverage__;
    }, [], function(response) {
      fs.writeFileSync('.nyc_output/' + uuid().replace(/-/g, '') + '.json', JSON.stringify(response.value));
    });
  })
}


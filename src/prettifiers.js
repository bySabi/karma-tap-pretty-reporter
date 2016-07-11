var PassThrough = require('readable-stream/passthrough');

module.exports = {
  'faucet': {
    prettify: function() { return require('faucet') },
    separator: function() { return '****************************'}
  },
  'tap-spec': {
    prettify: function() { return require('tap-spec') },
    separator: function() { return '****************************'}
  },
  'default': {
    prettify: function() { return function () { return new PassThrough() }},
    separator: function() { return '' }
   }
}

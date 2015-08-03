require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');
var fromFolder = R.unary(R.partial(require('path').join, __dirname));
var exists = require('fs').existsSync;
var unlink = require('fs').unlinkSync;

describe('csv-pair', function () {
  var pair;

  beforeEach(function () {
    pair = require('..');
  });

  it('is a function', function () {
    la(check.fn(pair));
  });

  it('combines two CSV files', function () {
    var filenames = ['1-5-days.csv', '1-10-days.csv'].map(fromFolder);
    var saveFilename = fromFolder('combined.csv');

    if (exists(saveFilename)) {
      unlink(saveFilename);
    }
    la(!exists(saveFilename), 'do not have the output file', saveFilename);

    pair(filenames, saveFilename);
    la(exists(saveFilename), 'found created file', saveFilename);
  });

});

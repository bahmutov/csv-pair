require('lazy-ass');
var check = require('check-more-types');

describe('csv-pair', function () {
  var pair;

  beforeEach(function () {
    pair = require('..');
  });

  it('is a function', function () {
    la(check.fn(pair));
  });

});

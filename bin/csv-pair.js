#!/usr/bin/env node

require('lazy-ass');
var check = require('check-more-types');

if (process.argv.length !== 5) {
  console.log('Usage: <filename1.csv> <filename2.csv> <output.csv>');
  process.exit(-1);
}

var pair = require('../src/csv-pair');
la(check.fn(pair), 'expected function', pair);

var inputFilenames = [
  process.argv[2],
  process.argv[3]
];
pair(inputFilenames, process.argv[4]);

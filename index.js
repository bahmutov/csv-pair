var loadCsv = require('csv-load-sync');
var filenames = ['1-5-days.csv', '1-10-days.csv'];

var loaded = filenames.map(loadCsv);
console.log('loaded', loaded.length, 'CSV files');
console.log('first CSV file has', loaded[0].length, 'records');
console.log('second CSV file has', loaded[1].length, 'records');

// assume object properties in the same order as columns
console.assert(loaded[0].length === loaded[1].length, 'different number of records');
var columns = Object.keys(loaded[0][0]);
console.log('first CSV columns\n  ' + columns.join('\n  '));

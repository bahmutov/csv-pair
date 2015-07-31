require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');
var fs = require('fs');
var path = require('path');
var loadCsv = require('csv-load-sync');
var filenames = ['1-5-days.csv', '1-10-days.csv'];

var loaded = filenames.map(loadCsv);
console.log('loaded', loaded.length, 'CSV files');
console.log('first CSV file has', loaded[0].length, 'records');
console.log('second CSV file has', loaded[1].length, 'records');

// assume object properties in the same order as columns
console.assert(loaded[0].length === loaded[1].length, 'different number of records');
var columns = Object.keys(loaded[0][0]);
// console.log('first CSV columns\n  ' + columns.join('\n  '));

var areSameValues = R.curry(function (objectsA, objectsB, name) {
  var valuesA = R.pluck(name, objectsA);
  var valuesB = R.pluck(name, objectsB);
  return R.equals(valuesA, valuesB);
});

var identical = columns.map(areSameValues(loaded[0], loaded[1]));
columns.forEach(function (name, k) {
  console.log(' ', name, 'is same?', identical[k]);
});

function combineColumns(objectsA, nameA, objectsB, nameB, columns, identical) {
  la(check.array(objectsA));
  la(check.unemptyString(nameA));
  la(check.array(objectsB));
  la(check.unemptyString(nameB));
  la(check.array(identical));

  var combined = [];
  objectsA.forEach(function (objectA, objectIndex) {
    var objectB = objectsB[objectIndex];
    var object = {};
    columns.forEach(function (columnName, k) {
      if (identical[k]) {
        object[columnName] = objectA[columnName];
      } else {
        object[columnName + ' - ' + nameA] = objectA[columnName];
        object[columnName + ' - ' + nameB] = objectB[columnName];
      }
    });
    combined.push(object);
  });

  return combined;
}

function objectsToCsvText(objects) {
  la(check.array(objects));
  la(check.not.empty(objects), 'empty combined objects', objects);
  var combinedColumnNames = Object.keys(objects[0]);

  var text = combinedColumnNames.join(',') + '\n';

  objects.forEach(function (object) {
    var values = R.values(object);
    text += values.join(',') + '\n';
  });

  return text;
}

var combined = combineColumns(loaded[0], path.basename(filenames[0], '.csv'),
  loaded[1], path.basename(filenames[1], '.csv'),
  columns, identical);
la(check.array(combined), 'could not get combined array of objects', combined);
var saveFilename = 'combined.csv';
var csvText = objectsToCsvText(combined);
fs.writeFileSync(saveFilename, csvText);
console.log('saved combined CSV', saveFilename);

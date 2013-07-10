/* This test is built in order to understand how to reduce the JSON
   data from our elasticsearch query */
fs = require('fs');
_ = require('underscore');
Q = require('Q');

/* Reduction function for search data */
function reduce (search) {
    return _.reduce(search.hits, function(memo, obj) {
    	_.extend(memo,obj);})
};

var promise = Q.nfcall(fs.readFile,'resources/SearchData.json', 'utf8');
var val = promise.then(function(data) { 
    var results = JSON.parse(data);
    return results[0];
});
Q.resolve(val).then(console.log);

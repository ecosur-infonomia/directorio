var q = require('Q');


function doSomethingAsync() {
  var deferred = q.defer();
  setTimeout(function() {
    deferred.resolve('hello world');
  }, 500);

  return deferred.promise;
}

doSomethingAsync().then(function(val) {
  console.log('Promise Resolved!', val);
});
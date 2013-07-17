/* Copyright 2013, Andrew Waterman and ECOSUR */

var Q = require('q');
var Elastic = require('elasticsearchclient'),
   serverOptions = {
       host: 'localhost',
       port: 9200
   },
   client = new Elastic(serverOptions);

/* 
 * The index function populates and returns the index page 
 */
exports.index = function(req, res){
   /* Get all the regimenes names from Admin DB, if this 
      increases beyond 100 in the future, the size parameter
      must be increased as well. */
   var query = {
      "from": 0,
  	  "size": 100,      
      "query":{
          "query_string":{
              "query" : "*"
          }
      }
   };
   
   var promise = Q.defer();
   var search = client.search('reg', 'jdbc', query);
    
   /* Fulfillment and error handling */
   search.on('data', function(jsonStr) {
      var data = JSON.parse(jsonStr);
      var hits = data.hits.hits;
      promise.resolve(res.render('index', {
          'title': 'Directorio Interna de ECOSUR',
          'data' : hits}));
   });
  
   search.on('error', function(error){
      promise.reject(res.render(500, error));
   });
    
   /* Run our search */
   search.exec();
};
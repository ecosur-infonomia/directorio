var Q = require('Q');
var ElasticSearchClient = require('elasticsearchclient'),
    serverOptions = {
    	host: 'localhost',
    	port: 9200
	},
    elasticSearchClient = new ElasticSearchClient(serverOptions);
var _ = require('underscore');

/* Search the stream with posted data */
exports.search = function(req, res){
  var query = {
      "query":{
          "query_string":{
              "query" : req.body.phrase
          }
      }
  }; 
  var deferred = Q.defer();
  var search = elasticSearchClient.search(req.body.searchtype, 'jdbc', query);
    
  /* Fulfillment and error handling */
  search.on('data', function(data) {
      deferred.resolve(res.render('stream', {'data' : extract(data)}));
  });
  
  search.on('error', function(error){
      deferred.reject(res.render(500,'Error'));
  });
    
  /* Run our search */
  search.exec();

  /* Consolidation of JSON objects */
  function extract(jsonStr) {
      try {
      	var data = JSON.parse(jsonStr);
        var hits = data.hits.hits;
      	/* Use underscore to consolidate the objects */
        console.log("total hits: " + data.hits.total);
        console.log("array size: " + hits.length);  

      } catch (Exception) {
      	console.log("Error in conosolidation method!");
      }
      
      return JSON.stringify(hits);
  }
};
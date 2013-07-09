var Q = require('Q');
var ElasticSearchClient = require('elasticsearchclient'),
    serverOptions = {
    	host: 'localhost',
    	port: 9200
	},
    elasticSearchClient = new ElasticSearchClient(serverOptions);

/* Search the stream */
exports.search = function(req, res){
  var query = {
      "query":{
          "query_string":{
              "query" : req.body.phrase
          }
      }
  }; 
  var river = req.body.searchtype;
  var deferred = Q.defer();
  var search = elasticSearchClient.search(river, 'jdbc', query);
  search.on('data', function(data) { 
      deferred.resolve(res.render('stream', {'data' : data}));
  });
  search.on('error', function(error){
      deferred.reject(res.render(500,'Error'));
  });
  search.exec();  
};
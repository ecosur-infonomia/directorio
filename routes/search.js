ElasticSearchClient = require('elasticsearchclient');
var serverOptions = {
    host: 'localhost',
    port: 9200
};
var elasticSearchClient = new ElasticSearchClient(serverOptions);

/* Search the stream */
exports.search = function(req, res){
  var query = {
      "query":{
          "query_string":{
              "query" : req.body.phrase
          }
      }
  }; 
  elasticSearchClient.search('jdbc', 'jdbc', query)
    .on('data', function(data) {
        res.render('stream', {'data' : data});
    })
    .on('error', function(error){
        console.log(error);
        res.render(500,'Error');
    })
    .exec()  
};
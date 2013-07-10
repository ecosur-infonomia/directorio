/* Simple integration test to get started */

ElasticSearchClient = require('elasticsearchclient');
var serverOptions = {
    host: 'localhost',
    port: 9200
};

var query = {
    "query":{
        "query_string":{
            "query" : "*"
        }
    }
};

var match = {
    "query": {
        "field" : {
          "NO01_CORREO1" : "iocampo@ecosur.mx"
        }
    }
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);
elasticSearchClient.search('jdbc', 'jdbc', match)
    .on('data', function(data) {
        //console.log(data);
        console.log(JSON.parse(data))
    })
    .on('done', function(){
        console.log(">> query complete");
        //always returns 0 right now
    })
    .on('error', function(error){
        console.log(error)
    })
    .exec()
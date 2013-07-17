var Q = require('Q');
var ElasticSearchClient = require('elasticsearchclient'),
    serverOptions = {
    	host: 'localhost',
    	port: 9200
	},
    elasticSearchClient = new ElasticSearchClient(serverOptions);

/* Perform a search */
exports.search = function(req, res){
  var size = req.size || 10,
      current = req.from || 0;
  var query_string = {
      "from": current,
  	  "size": size,
      "query":{
          "query_string":{
              "query" : req.body.phrase
          }
      }
  }; 
  var promise = Q.defer();
  var search = elasticSearchClient.search('admin', 'jdbc', query_string);
  
  /* error callback */
  search.on('error', function(error){
      promise.reject(res.status(500).send('Error'));
  });

  /* data callback */
  search.on('data', function(jsonStr) {
      var data = JSON.parse(jsonStr);
      var hits = data.hits.hits;
      console.log(hits);
      console.log("total hits: " + data.hits.total);
      
      /* Create the page list to pass on to the view engine 
        for individual page numbering if desired */
      var pages = [];
      var number = (data.hits.total) / size;
      if (number > 1) {
      	for (var i = 0; i < number; i++) {
      		pages.push({"page" : i + 1 });
      	}
      }
      console.log("Pages: " + number);
      var back, next;
      (current >= size) ? back = current - size : back = 0;
      next = current + size;
      
      promise.resolve(res.render('admin', {
          'query' : req.body.phrase, 
          'data'  : hits,	// Returned search hits
          'size'  : size,   // Number of pages to return per call
          'pages' : pages,  // Number of pages total in the search
          'back'  : back,   // from parameter for back 
          'next'  : next    // from parameter for next
      }));
  });
    
  /* Execute the search */
  search.exec();

};

/* Page through a search stream */
exports.page = function(req, res) {
    var current = parseInt(req.query.page);
    var size = parseInt(req.query.size);

    var query_string =  {
      "from": current,
      "size": size,
      "query":{
        "query_string": { "query": req.query.query }
      }
    }

  var promise = Q.defer();
  var search = elasticSearchClient.search('admin', 'jdbc', query_string);

  /* error callback */
  search.on('error', function(error){
      promise.reject(res.status(500).send('Error'));
  });

  /* data callback */
  search.on('data', function(jsonStr) {
      var data = JSON.parse(jsonStr);
      var hits = data.hits.hits;
      
      /* Create the page list to pass on to the view engine 
        for individual page numbering if desired */
      var pages = [];
      var number = (data.hits.total) / size;
      if (number > 1) {
        for (var i = 0; i < number; i++) {
          pages.push({"page" : i + 1 });
        }
      }

      var back, next;
      (current >= size) ? back = current - size : back = 0;
      next = current + size;
      
      promise.resolve(res.render('admin', {
          'query' : req.query.query, 
          'data'  : hits,              // Returned search hits
          'size'  : size,              // Number of pages to return per call
          'pages' : pages,             // Number of pages total in the search
          'back'  : back,              // from parameter for back 
          'next'  : next               // from parameter for next
      }));
  });
  
  search.exec(); // Run the next query to ES 
  
};
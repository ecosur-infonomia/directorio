var Q = require('Q'),
    ElasticSearchClient = require('elasticsearchclient'),
    serverOptions = {
        host: 'localhost',
        port: 9200
    },
    elasticSearchClient = new ElasticSearchClient(serverOptions),
    domain = require('domain');

/* Perform a search */
exports.search = function(req, res){
  var d = domain.create();
  d.on("error", function(error) {
      console.log("Error!", error);
  });
  d.add(req);
  d.add(res);
  d.run(function() {
    var size = req.body.size || 10,
        current = req.body.from || 0;
    var query_string = {
        "from": current,
        "size": size,
        "query":{
            "query_string":{
                "query" : req.body.phrase
            }
        },
        "sort" : [
          "_score",
          { "NO01_APELLIDO_PAT" : {"missing" : "_last"} }
      ]
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
        
        promise.resolve(res.render('search', {
            'query' : req.body.phrase, 
            'data'  : hits, // Returned search hits
            'size'  : size,   // Number of pages to return per call
            'pages' : pages,  // Number of pages total in the search
            'back'  : back,   // from parameter for back 
            'next'  : next    // from parameter for next
        }));
    });      
    /* Execute the search */
    search.exec();

  })};

/* Page through a search stream */
exports.page = function(req, res) {
  var d = domain.create();
  d.on("error", function(error) {
      console.log("Error!", error);
  });
  d.add(req);
  d.add(res);
  d.run(function() {
    var current = parseInt(req.query.page);
    var size = parseInt(req.query.size);

    /* Paged query has different sort than POST in terms of score result */
    var query_string =  {
        "from": current,
        "size": size,
        "query":{
          "query_string": { "query": req.query.query }
        },
        "sort" : [
          { "NO01_APELLIDO_PAT" : {"missing" : "_last"} },
        "_score"
        ]
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
        
        promise.resolve(res.render('search', {
            'query' : req.query.query, 
            'data'  : hits,              // Returned search hits
            'size'  : size,              // Number of pages to return per call
            'pages' : pages,             // Number of pages total in the search
            'back'  : back,              // from parameter for back 
            'next'  : next               // from parameter for next
        }));
    });
    search.exec(); // Run the next query to ES 
  })};

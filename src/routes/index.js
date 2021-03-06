/* Copyright 2013, Andrew Waterman and ECOSUR */

var Q = require('q'),
   Elastic = require('elasticsearchclient'),
   serverOptions = {
       host: 'localhost',
       port: 9200
   },
   client = new Elastic(serverOptions),
   domain = require('domain');

/* 
 * The index function populates and returns the index page 
 */
exports.index = function(req, res){
  /* Domains enable easy error catching and keep the server from 
     crashing */
  var d = domain.create();
  d.on("error", function(error) {
      console.log("Error!", error);
      res.render('500', {status: 500, error : error });
  });
  d.add(req);
  d.add(res);
  d.run(function() {
    var current = (!req.query.page) ? 10 : parseInt(req.query.page, 10);
    var size = (!req.query.size) ? 10 : parseInt(req.query.size, 10);

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
        },
        "sort" : [
          { "NO10_NOMBRE" : { "order" : "asc", "mode" : "avg"} }
        ]
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
        promise.reject(res.render(500, { status: 500, error: error} ));
     });
     /* Run our search */
     search.exec();
  })};

var express = require('express'),
  exphbs  = require('express3-handlebars'),
  routes = require('./routes'),
  search = require('./routes/search'),
  http = require('http'),
  path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
/* Use express3-handlebars as default render engine, with 
   no layout. */
app.engine('handlebars', exphbs({defaultLayout: false}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/search', search.search);
app.get('/search', search.page);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
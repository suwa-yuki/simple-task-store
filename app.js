var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var ITEMS_FILE = path.join(__dirname, 'items.json');

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/items', function(req, res) {
  fs.readFile(ITEMS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/items', function(req, res) {
  fs.readFile(ITEMS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var items = JSON.parse(data);
    items.push({
      id: Date.now(),
      text: req.body.text
    });
    fs.writeFile(ITEMS_FILE, JSON.stringify(items, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(items);
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
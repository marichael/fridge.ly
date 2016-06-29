var express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  mysql = require('mysql'),
  path = require('path'),
  Item = require('./database/item'),
  PurchasedItem = require('./database/purchased_item'),
  UsedItem = require('./database/used_item');

var app = express();
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));

// TODO NO IDEA WHAT THIS SHIT IS
// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// request should be a list with each element having a name, quantity, unit, and cost
app.post('/items', function (req, res) {
  if (!req.body) return res.sendStatus(400);

  var itemList = req.body;
  promises = itemList.map(function(item) {
    Item.where('name', item.name).fetch().then(function(results){
      if (results === null) {
        Item.forge({name: item.name, quantity: item.quantity}).save().then(function(r) {
          var itemId = r.get('id');
          PurchasedItem.forge({item_id: itemId, quantity: item.quantity, unit: 0, cost: 0}).save().then(function(r) {
            if (r) console.log('post add item');
          });
        });
      } else {
        Item.forge().where({name: item.name}).save({quantity: parseInt(results.get('quantity'))+parseInt(item.quantity)}, { method: 'update' }).then(function(r){
          var itemId = results.get('id');
          PurchasedItem.forge({item_id: itemId, quantity: item.quantity, unit: 0, cost: 0}).save().then(function(r) {
            if (r) console.log('POST add item');
          });
        });
      }
    });
  });
  Promise.all(promises).then(function() {
    return res.send('Success');
  });
});

// request should be a list with each element having a name, quantity, and unit
app.delete('/items', function (req, res) {
  if (!req.body) return res.sendStatus(400);

  var itemList = req.body;
  promises = itemList.map(function(item) {
    Item.where('name', item.name).fetch().then(function(results){
      if (results === null) {
        // error since any removed item should already exist
        return res.end(400);
      } else {
        Item.forge().where({name: item.name}).save({quantity: Math.max(0, results.get('quantity')-item.quantity)}, { method: 'update' });
        var itemId = results.get('id');
      }
      UsedItem.forge({item_id: itemId, quantity: item.quantity, unit: 0}).save().then(function(results) {
        if (results) return res.end('DELETE remove item');
      });
    });
  });
  Promise.all(promises).then(function() {
    return res.send('Success');
  });
});

app.get('/items', function(req, res) {
  new Item().fetchAll()
    .then(function(items) {
      res.json(items.toJSON());
    }).catch(function(error) {
      console.log(error);
      res.send('An error occured');
    });
});

http.createServer(app).listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port 3000");
});

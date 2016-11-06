var express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  mysql = require('mysql'),
  path = require('path'),
  bookshelf = require('./database/db'),
  Item = require('./database/item'),
  PurchasedItem = require('./database/purchased_item'),
  Recipe = require('./database/recipe'),
  UsedItem = require('./database/used_item');

var app = express();
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}))

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

app.get('/recipes', function(req, res) {
  new Recipe().fetchAll()
    .then(function(recipes) {
      res.json(recipes.toJSON());
    }).catch(function(error) {
      console.log(error);
      res.send('An error occured');
    });
});

app.post('/recipes', function (req, res) {
  if (!req.body) return res.sendStatus(400);

  var recipe = req.body;

  if (recipe.name === undefined) {
    return res.sendStatus(400);
  }

    return Recipe.forge({
      name: recipe.name,
      book_name: recipe.book_name,
      page_number: recipe.page_number,
      link: recipe.link,
    }).save(null).then(function(success) {
      res.send('SUCCESS');
    }).catch(function(failure) {
      console.log(failure);
      res.status(400).send(failure);
    });
});

// request should be a list with each element having a name, quantity, unit, and cost
app.post('/items', function (req, res) {
  if (!req.body) return res.sendStatus(400);

  var itemList = req.body;

  bookshelf.transaction(function(t) {
    promises = itemList.map(function(item) {
      return Item.where('name', item.name).fetch().then(function(results){
        if (results === null) {
          return Item.forge({name: item.name, quantity: item.quantity, unit: item.unit}).save(null, {transacting: t}).then(function(r) {
            var itemId = r.get('id');
            return PurchasedItem.forge({item_id: itemId, quantity: item.quantity, unit: item.unit, cost: 0}).save(null, {transacting: t});
          });
        }
        if (item.unit !== results.get('unit')) {
          return Promise.reject("Unit mismatch for " + item.name);
        } else {
          return Item.forge().where({name: item.name}).save({quantity: parseFloat(results.get('quantity'))+parseFloat(item.quantity)}, {method: 'update', transacting: t}).then(function(r){
            var itemId = results.get('id');
            return PurchasedItem.forge({item_id: itemId, quantity: item.quantity, unit: item.unit, cost: 0}).save(null, {transacting: t});
          });
        }
      });
    });
    return Promise.all(promises).then(t.commit).catch(t.rollback);
  }).then(function(success) {
    res.send('SUCCESS');
  }).catch(function(failure) {
    res.status(400).send(failure);
  });
});

// request should be a list with each element having a name, quantity, and unit
app.delete('/items', function (req, res) {
  if (!req.body) return res.sendStatus(400);

  var itemList = req.body;

  bookshelf.transaction(function(t) {
    promises = itemList.map(function(item) {
      return Item.where('name', item.name).fetch().then(function(results){
        if (results === null) {
          return Promise.reject("No purchased item exists for " + item.name);
        }
        if (item.unit !== results.get('unit')) {
          return Promise.reject("Unit mismatch for " + item.name);
        } else {
          return Item.forge().where({name: item.name}).save({quantity: parseFloat(results.get('quantity'))-parseFloat(item.quantity)}, {method: 'update', transacting: t}).then(function(r) {
            var itemId = results.get('id');
            return UsedItem.forge({item_id: itemId, quantity: item.quantity, unit: item.unit}).save(null, {transacting: t})
          });
        }
      });
    });
    return Promise.all(promises).then(t.commit).catch(t.rollback);
  }).then(function(success) {
    res.send('SUCCESS');
  }).catch(function(failure) {
    res.status(400).send(failure);
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

process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err);
});

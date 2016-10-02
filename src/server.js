var express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  mysql = require('mysql'),
  path = require('path'),
  React = require('react'),
  renderToString = require('react-dom/server'),
  ReactRouter = require('react-router'),
  routes = require('./routes'),
  bookshelf = require('../database/db'),
  Item = require('../database/item'),
  PurchasedItem = require('../database/purchased_item'),
  UsedItem = require('../database/used_item');

const app = new express();
const server = new http.Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));
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
          return Promise.reject(`Unit mismatch for ${item.name}`);
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
          return Promise.reject(`No purchased item exists for ${item.name}`);
        }
        if (item.unit !== results.get('unit')) {
          return Promise.reject(`Unit mismatch for ${item.name}`);
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
//
// app.get('/items', function(req, res) {
//   new Item().fetchAll()
//     .then(function(items) {
//       res.json(items.toJSON());
//     }).catch(function(error) {
//       console.log(error);
//       res.send('An error occured');
//     });
// });

app.get('*', (req, res) => {
  ReactRouter.match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }

      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        markup = renderToString(<ReactRouter.RouterContext {...renderProps}/>);
      }

      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});

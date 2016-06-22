var bookshelf = require('./db');

var Item = bookshelf.Model.extend({
	tableName: 'items'
})

module.exports = Item;

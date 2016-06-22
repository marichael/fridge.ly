var bookshelf = require('./db');

var PurchasedItem = bookshelf.Model.extend({
	tableName: 'purchased_items'
})

module.exports = PurchasedItem;

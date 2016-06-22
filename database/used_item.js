var bookshelf = require('./db');

var UsedItem = bookshelf.Model.extend({
	tableName: 'used_items'
})

module.exports = UsedItem;

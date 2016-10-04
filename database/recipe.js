var bookshelf = require('./db');

var Recipe = bookshelf.Model.extend({
	tableName: 'recipes'
})

module.exports = Recipe;

var bookshelf = require('./db');

var RecipeExecution = bookshelf.Model.extend({
	tableName: 'recipe_executions'
})

module.exports = RecipeExecution;

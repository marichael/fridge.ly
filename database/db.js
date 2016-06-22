var mysql = require('mysql');

var knex = require('knex')({
  client: 'mysql',
  connection: {
	  host     : 'localhost',
	  user     : 'mari.miyachi',
	  password : '',
	  database : 'fridgely'
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;

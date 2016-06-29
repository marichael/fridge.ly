var mysql = require('mysql');

var env = process.env.NODE_ENV || 'development';
var knexFile = require('../knexfile.js');
var knex = require('knex')(knexFile[env]);

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;

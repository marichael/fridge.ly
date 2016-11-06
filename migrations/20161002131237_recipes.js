
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('recipes', function(table) {
      table.increments();
      table.string('name').notNullable();
      table.string('book_name').notNullable();
      table.integer('page_number').notNullable();
      table.string('link').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('made_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('recipes')
};


exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTableIfNotExists('recipes', function(table) {
        table.increments();
        table.string('name').notNullable();
        table.string('book_name').notNullable();
        table.integer('page_number').notNullable();
        table.string('link').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      }),
      knex.schema.createTableIfNotExists('recipe_executions', function(table) {
        table.increments();
        table.integer('recipe_id').notNullable(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('executed_at').defaultTo(knex.fn.now());
      }),
  ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('recipes'),
      knex.schema.dropTable('recipe_executions'),
    ])
};

// TODO: fix this error message
// Warning: a promise was created in a handler but was not returned from it
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('purchased_items', function(table) {
      table.increments();
      table.integer('item_id').notNullable();
      table.decimal('quantity').notNullable();
      table.enu('unit', ['volume','weight','count']).notNullable();
      table.decimal('cost').notNullable();
      table.timestamp('purchased_at').defaultTo(knex.fn.now());
    }),
    knex.schema.createTableIfNotExists('used_items', function(table) {
      table.increments();
      table.integer('item_id').notNullable();
      table.decimal('quantity').notNullable();
      table.enu('unit', ['volume','weight','count']).notNullable();
      table.timestamp('used_at').defaultTo(knex.fn.now());
    }),
    knex.schema.createTableIfNotExists('items', function(table) {
      table.increments();
      table.string('name').notNullable();
      table.decimal('quantity').notNullable();
      table.enu('unit', ['volume','weight','count']).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items'),
    knex.schema.dropTable('purchased_items'),
    knex.schema.dropTable('used_items')
  ]);
};

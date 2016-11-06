
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('shopping_lists', function(table) {
            table.increments();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.boolean('done');
        }),
        knex.schema.createTableIfNotExists('shopping_items', function(table) {
            table.increments();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.string('name').notNullable();
            table.string('quantity').notNullable();
            table.integer('shopping_list_id').notNullable();
            table.integer('recipe_id').notNullable();
            table.boolean('purchased');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('shopping_lists'),
        knex.schema.dropTable('shopping_items')
    ])
};

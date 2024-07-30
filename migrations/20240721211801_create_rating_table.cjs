/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema.createTable('Rating', function (table) {
    table.increments('id').primary();
    table.integer('ride_id').unsigned().references('id').inTable('Ride');
    table.integer('passenger_rating');
    table.integer('driver_rating');
    table.text('driver_comments');
    table.text('passenger_text');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Rating');
};

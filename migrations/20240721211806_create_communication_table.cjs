/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Communication', function (table) {
    table.increments('id').primary();
    table.integer('ride_id').unsigned().references('id').inTable('Ride');
    table.text('driver_message');
    table.text('passnger_message');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Communication');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Fare', function (table) {
    table.increments('id').primary();
    table.float('base_fare');
    table.time('time_fare');
    table.time('max_wait_time');
    table.float('distance_fare');
    table.float('wait_time_fee');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Fare');
};

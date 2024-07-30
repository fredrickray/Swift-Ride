/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Driver_Availability', function (table) {
    table.increments('id').primary();
    table.integer('driver_id').unsigned().references('id').inTable('Driver');
    table.boolean('available');
    table.float('location_lat');
    table.float('location_lon');
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Driver_Availability');
};

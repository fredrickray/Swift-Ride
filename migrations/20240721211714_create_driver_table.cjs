/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Driver', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('User');
    table.string('driver_license');
    table.integer('vehicle_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Driver');
};

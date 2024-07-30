/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Address', function (table) {
    table.increments('id').primary();
    table
      .integer('passenger_id')
      .unsigned()
      .references('id')
      .inTable('Passenger');
    table.string('address_name');
    table.float('address_latitude');
    table.float('address_longitude');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Address');
};

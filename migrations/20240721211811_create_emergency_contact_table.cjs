/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Emergency_Contact', function (table) {
    table.increments('id').primary();
    table
      .integer('passenger_id')
      .unsigned()
      .references('id')
      .inTable('Passenger');
    table.string('name');
    table.string('phone_number');
    table.string('relationship');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Emergency_Contact');
};

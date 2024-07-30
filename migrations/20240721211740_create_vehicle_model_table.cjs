/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Vehicle_Model', function (table) {
    table.increments('id').primary();
    table
      .integer('make_id')
      .unsigned()
      .references('id')
      .inTable('Vehicle_Make');
    table.string('name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Vehicle_Model');
};

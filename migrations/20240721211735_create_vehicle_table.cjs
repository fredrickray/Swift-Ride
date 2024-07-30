/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Vehicle', function (table) {
    table.increments('id').primary();
    table.integer('driver_id').unsigned().references('id').inTable('Driver');
    table
      .integer('make_id')
      .unsigned()
      .references('id')
      .inTable('Vehicle_Make');
    table
      .integer('type_id')
      .unsigned()
      .references('id')
      .inTable('Vehicle_Type');
    table.integer('year');
    table.string('license_plate_imageUrl');
    table.string('vehicle_credentials_imageUrl');
    table.string('color');
    table.string('vehicle_front_photo');
    table.string('vehicle_back_photo');
    table.string('vehicle_inside_photo');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Vehicle');
};

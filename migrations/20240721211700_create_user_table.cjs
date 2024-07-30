/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('User', function (table) {
    table.increments('id').primary();
    table.string('google_id').nullable();
    table.string('name');
    table.string('email').unique().notNullable();
    table.string('password').nullable();
    table.string('phone_number');
    table.boolean('isVerified').defaultTo(false);
    table.integer('role_id').unsigned().references('id').inTable('Role');
    table.integer('otp').unsigned().nullable();
    table.dateTime('otpExpiry').nullable();
    table.string('passwordResetToken').nullable();
    table.dateTime('passwordResetExpiry').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('User');
};

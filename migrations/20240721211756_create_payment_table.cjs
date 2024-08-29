/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return (
    knex.schema
      // Step 1: Create Tables Without Foreign Keys
      .createTable('Payment', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned(); // No foreign key constraint yet
        table.enu('type', ['card', 'cash', 'wallet']);
        table.float('amount');
        table.enu('status', [
          'initiated',
          'pending',
          'completed',
          'declined',
          'reversed',
        ]);
        table.datetime('transaction_date');
      })
      .createTable('Ride', function (table) {
        table.increments('id').primary();
        table.integer('passenger_id').unsigned(); // No foreign key constraint yet
        table.integer('driver_id').unsigned(); // No foreign key constraint yet
        table.enu('status', [
          'initiated',
          'driver_accepted',
          'driver_coming',
          'driver_arrived',
          'driver_canceled',
          'started',
          'passenger_canceled',
          'transit',
          'completed',
        ]);
        table.string('pickup_location');
        table.float('pickup_location_lat');
        table.float('pickup_location_lon');
        table.string('dropoff_location');
        table.float('dropoff_location_lat');
        table.float('dropoff_location_lon');
        table.integer('fare_id').unsigned(); // No foreign key constraint yet
        table.datetime('start_time');
        table.datetime('end_time');
        table.datetime('arrival_time');
        table.integer('payment_id').unsigned(); // No foreign key constraint yet
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      // Step 2: Add Foreign Key Constraints
      .then(() => {
        return knex.schema.alterTable('Payment', function (table) {
          table.foreign('user_id').references('id').inTable('User');
        });
      })
      .then(() => {
        return knex.schema.alterTable('Ride', function (table) {
          table.foreign('passenger_id').references('id').inTable('Passenger');
          table.foreign('driver_id').references('id').inTable('Driver');
          table.foreign('fare_id').references('id').inTable('Fare');
          table.foreign('payment_id').references('id').inTable('Payment');
        });
      })
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('Ride', function (table) {
    table.dropForeign('passenger_id');
    table.dropForeign('driver_id');
    table.dropForeign('fare_id');
    table.dropForeign('payment_id');
  });
  await knex.schema.alterTable('Payment', function (table_1) {
    table_1.dropForeign('user_id');
  });
  return await knex.schema.dropTable('Ride').dropTable('Payment');
};

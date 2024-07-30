/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('Payment', function (table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('User');
      table.integer('ride_id').unsigned().references('id').inTable('Ride');
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
      table
        .integer('passenger_id')
        .unsigned()
        .references('id')
        .inTable('Passenger');
      table.integer('driver_id').unsigned().references('id').inTable('Driver');
      table.enu('status', [
        'completed',
        'driver_accepted',
        'delayed',
        'driver_canceled',
        'passenger_canceled',
        'started',
        'driver_coming',
        'driver_arrived',
        'transit',
      ]);
      table.string('pickup_location');
      table.float('pickup_location_lat');
      table.float('pickup_location_lon');
      table.string('dropoff_location');
      table.float('dropoff_location_lat');
      table.float('dropoff_location_lon');
      table.integer('fare_id').unsigned().references('id').inTable('Fare');
      table.datetime('start_time');
      table.datetime('end_time');
      table.datetime('arrival_time');
      table
        .integer('payment_id')
        .unsigned()
        .references('id')
        .inTable('Payment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('Payment').dropTable('Ride');
};

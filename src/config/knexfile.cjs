// // Update with your config settings.

// /**
//  * @type { Object.<string, import("knex").Knex.Config> }
//  */
// module.exports = {
//   development: {
//     client: 'mysql',
//     connection: {
//       filename: './dev.sqlite3'
//     }
//   },

//   staging: {
//     client: 'mysql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: './migrations'
//     }
//   },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// };

// const sharedConfig = {
//   client: 'mysql',
//   migrations: {
//     directory: '../../migrations',
//   },
//   seeds: {
//     directory: '../../seeds',
//   },
// };

// module.exports = {
//   development: {
//     ...sharedConfig,
//     connection: {
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     },
//   },
//   production: {
//     ...sharedConfig,
//     connection: {
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     },
//   },
// };

// module.exports = {
//   development: {
//     client: 'mysql',
//     connection: {
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     },
//     migrations: {
//       directory: './migrations',
//     },
//     seeds: {
//       directory: './seeds',
//     },
//   },
// };
// knexfile.cjs

const dotenv = require('dotenv');
dotenv.config();
const knex = require('knex');

const config = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'SwiftRide',
      port: 8889, // default MySQL port for MAMP
    },
    migrations: {
      directory: '../../migrations',
    },
    seeds: {
      directory: './src/config/seeds',
    },
  },
};

module.exports = config;

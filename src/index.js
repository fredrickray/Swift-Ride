import 'dotenv/config';
import App from './server.js';

const server = new App();
// console.log(process.env.DB_USER);
// console.log(process.env.DB_NAME);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_CLIENT);
server.start(process.env.PORT || 9090);

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
// import session from 'express-session';
// import rateLimit from 'express-rate-limit';
import { errorHandler, routeNotFound } from './middlewares/errorMiddleware.js';
import indexRouter from './v1/routes/index.js';

class App {
  constructor() {
    this.app = express();
    this.server = createServer(this.app); // Create HTTP server
    this.io = new SocketIOServer(this.server); // Attach socket.io to the server

    this.initializeMiddlewares();
    this.routes();
    this.initializeSocket();
    this.handleErrors();
  }

  initializeMiddlewares() {
    // this.app.use(helmet());
    // this.app.use(morgan('combined'));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(
      cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'UPDATE', 'DELETE', 'OPTIONS', 'PUT'],
        credentials: true,
        allowedHeaders: ['X-Requested-With', 'Content-Type'],
      })
    );

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    const sessionConfig = {
      secret: process.env.SESSION_SECRET || 'your_session_secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    };

    // this.app.use(session(sessionConfig));
    // this.app.disable('x-powered-by');

    // const limiter = rateLimit({
    //   windowMs: 15 * 60 * 1000,
    //   max: 100,
    // });
    // this.app.use(limiter);
  }

  routes() {
    this.app.get('/api', (req, res) => {
      res.send({
        success: true,
        message: 'Server initialized and ready for action!',
      });
    });
    this.app.use('/api', indexRouter);
  }

  initializeSocket() {
    this.io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);

      // Example event
      socket.on('message', (data) => {
        console.log('Received message:', data);
        // Broadcasting the message to all clients
        this.io.emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  handleErrors() {
    this.app.use(errorHandler);
    this.app.use(routeNotFound);
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Server initialized and ready for action! 🤖`);
      console.log('     /\\_/\\');
      console.log('    / o o \\');
      console.log('   (   "   )');
      console.log('    \\~(*)~/');
      console.log('     /___\\');
      console.log('Welcome to the enchanted forest of code!');
      console.log(process.env.PORT);
    });
  }
}

export default App;

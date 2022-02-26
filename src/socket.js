import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { onConnection } from './routes/socket.js';

export const httpServer = createServer(app);

export const io = new Server(httpServer, {});

io.on('connection', onConnection);

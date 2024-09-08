import { Server } from 'socket.io';
import { Server as HttpServer } from 'http'; // To differentiate between Socket.IO Server and HTTP Server
import config from './Config/config';

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [config.server.base_url],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('chat message', (msg) => {
      console.log(`Message: ${msg}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

// Get the instance of io to use in other parts of the application
export const getSocketIO = (): Server | null => {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initSocket first.");
  }
  return io;
};

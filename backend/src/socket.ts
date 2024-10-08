import { Server } from 'socket.io';
import { Server as HttpServer } from 'http'; // To differentiate between Socket.IO Server and HTTP Server

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {

  // allowed origins
  io = new Server(server, {
    cors: {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowedOrigins = ['https://taaskify.com/','http://localhost:5173'];
        if (origin && allowedOrigins.includes(origin)) {
          callback(null, true); // Allow the request
        } else {
          callback(new Error('Not allowed by CORS')); // Block the request
        }
      },
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

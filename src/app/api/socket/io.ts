import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function ioHandler(req: NextApiRequest, res: unknown) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
        socket.on('note-update', (data) => {
          socket.to(roomId).emit('note-update', data);
        });
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
          socket.leave(roomId);
        });
      });
    });
    res.socket.server.io = io;
  }
  res.end();
}

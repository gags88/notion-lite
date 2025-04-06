import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const useSocket = (roomId: string) => {
  useEffect(() => {
    socket = io({
      path: '/api/socket/io',
    });
    socket.emit('join-room', roomId);
    return () => {
      if (socket) socket.disconnect();
    };
  }, [roomId]);
  return socket;
};

export default useSocket;

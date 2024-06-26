import { Socket } from 'socket.io';
import { User } from 'src/modules/users/entities/user.entity';
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export interface AuthSocket extends Socket {
  user: User;
}

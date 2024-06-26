import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthSocket, SocketMiddleware } from 'src/constans/type';
import { UsersService } from 'src/modules/users/users.service';

export const WSAuthMiddleware = (
  jwtService: JwtService,
  usersService: UsersService,
  configService: ConfigService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.jwt;
      const decoded = jwtService.verify(token, {
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
      const user = await usersService.findUserByEmail(decoded.email);
      if (user) {
        socket.user = user;
        next();
      } else {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    } catch (error) {
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      });
    }
  };
};

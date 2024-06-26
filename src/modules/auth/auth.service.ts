import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Hash } from 'src/utils/util.hash';
import { IUser } from '../users/users.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { IUserOauth } from './auth.interface';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private client = new OAuth2Client(
    this.configService.get<string>('CLIENT_ID'),
  );

  async verifyGoogleToken(token: string, response: Response) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.configService.get<string>('CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.registerWithGoogle({
      fullname: payload.name,
      email: payload.email,
    });

    return this.login(user as IUser, response);
  }

  async loginWithGoogle(userInfo: IUserOauth, response: Response) {
    const user = await this.usersService.registerWithGoogle(userInfo);
    return this.login(user as IUser, response);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(username);
    if (user) {
      const isValid = Hash.isValidPassword(pass, user.password);
      if (isValid) return user;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { id, username, email, role, avatar } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id,
      username,
      email,
      role,
      avatar,
    };

    const refresh_token = this.createRefreshToken(payload);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id,
        username,
        email,
      },
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  logout = async (user: IUser, response: Response) => {
    try {
      response.clearCookie('refresh_token');
      return 'success';
    } catch (error) {
      console.log(error);
    }
  };
}

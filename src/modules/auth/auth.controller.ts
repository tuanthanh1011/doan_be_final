import { Controller, Post, UseGuards, Res, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';
import { Response } from 'express';
import { ResponseMessage } from 'src/decorator/customize';
import { GoogleAuthGuard } from './google-auth.guard';
import { IUserOauth } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Post('/logout')
  @ResponseMessage('Đăng xuất thành công')
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLoginGoogle() {
    return { msg: 'Google OAuth' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(
    @User() user: IUserOauth,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.loginWithGoogle(user, response);
  }

  @Post('verify')
  async verifyToken(
    @Body('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.verifyGoogleToken(token, response);
  }
}

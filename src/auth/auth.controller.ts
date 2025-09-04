import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const {accessToken} = await this.authService.login(req.user);

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      path: '/', 
      secure: isProd,
    });
    return {
      message: 'Login successful',
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      path: '/',
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });
    return { message: 'Logged out' };
  }
}
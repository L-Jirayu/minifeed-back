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

    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    return {
      message: 'Login successful',
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { 
      message: 'Logged out' 
    };
  }
}
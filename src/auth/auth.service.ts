import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('User object before signing JWT:', user);  // <-- เพิ่มตรงนี้
    const userId = user._id?.toString() || user.id?.toString() || user.userId;
    const payload = { email: user.email, sub: userId };
    console.log('Signing JWT payload:', payload);           // <-- เพิ่มตรงนี้
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
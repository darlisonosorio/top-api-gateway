import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { Login } from './dtos/login';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  doLogin(@Body() body: Login) {
    return this.authService.login(body);
  }

}
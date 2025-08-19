import { Controller, Post, Body } from '@nestjs/common';
import { Login } from './dtos/login';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  doLogin(@Body() body: Login) {
    return this.authService.login(body);
  }

}
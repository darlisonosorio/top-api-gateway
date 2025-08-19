import { Module } from '@nestjs/common';
import { PingController } from './ping/ping.controller';
import { PingService } from './ping/ping.service';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { FinanceController } from './finance/finance.controller';
import { UsersController } from './users/users.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './common/guards/jwt-auth-guard';
import { AuthService } from './auth/auth.service';
import { AuthRepository } from './auth/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import {PassportModule} from "@nestjs/passport";
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TOP_USERS_URL || '',
          port: parseInt(process.env.TOP_USERS_PORT || '8888')
        }
      },
      {
        name: 'FINANCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TOP_FINANCE_URL || '',
          port: parseInt(process.env.TOP_FINANCE_PORT || '8889')
        }
      }
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'app-secret-key',
      signOptions: {
        expiresIn: process.env.EXPIRESIN || '1h',
      },
    })
  ],
  controllers: [
    PingController,
    UsersController,
    FinanceController,
    AuthController,
  ],
  providers: [
    AuthService,
    AuthRepository,
    PingService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    PassportModule,
    JwtModule
  ]
})
export class AppModule {}

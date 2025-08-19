import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Login } from './dtos/login';
import { UserData, UserDetail } from './dtos/user-detail';
import { AuthRepository } from './auth.repository';
import { JwtPayload } from './jwt.strategy';
import {JwtService} from "@nestjs/jwt";
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) {}

    async login(login: Login): Promise<UserDetail> {
        
        try {
            await validateOrReject(plainToInstance(Login, login));
        } catch (errors) {
            throw new BadRequestException({
                statusCode: 400, 
                message: errors
                .map((e) => Object.values(e.constraints || {}).join(', '))
                .join('; ')
            });
        }
        
        const { username, password } = login;

        // mock
        if (username !== 'admin' && password !== 'admin') {
            throw new UnauthorizedException('Username or password invalid');
        }
        const user = this.authRepository.getUserInfo(username);

        const token = this._createToken(user);
        return {
            ...user,
            token,
        };
    }

    private _createToken({ username }: UserData): string {
        const user: JwtPayload = { username };
        return this.jwtService.sign(user);
    }

    async validate(payload: JwtPayload): Promise<any> {
        const user = await this.authRepository.getUserInfo(payload.username);
        if (!user) {
            throw new HttpException(
               "INVALID_TOKEN", 
               HttpStatus.UNAUTHORIZED
            );
        }
        return user;
    }
}


export interface RegistrationStatus{
    success: boolean;
    message: string;
    data?: UserDetail;
}
export interface RegistrationSeederStatus {
    success: boolean;
    message: string;
    data?: UserDetail[];
}

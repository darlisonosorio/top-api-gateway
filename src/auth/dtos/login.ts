import { IsString } from 'class-validator';

export class Login {

  @IsString()
  username: string;

  @IsString()
  password: string;

}

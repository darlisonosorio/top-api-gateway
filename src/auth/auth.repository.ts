import { Injectable } from '@nestjs/common';
import { UserDetail } from 'src/auth/dtos/user-detail';


const admin: UserDetail  = {
  id: 1,
  username: 'admin',
  email: 'admin@email.com',
  full_name: 'Administrator',
  created_at: new Date(),
  updated_at: new Date()
}

@Injectable()
export class AuthRepository {

  constructor() {}

  getUserInfo(username: string): UserDetail {
    // implement real user_detail retrieval logic here
    return admin;
  }

}
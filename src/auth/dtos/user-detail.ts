export class UserData {
  id: number;
  username: string;
  email: string;
  full_name: string;
  created_at: Date;
  updated_at: Date;
}

export class UserDetail extends UserData {
    token?: string;
}

export class UserToken {
    Authorization: string;
}

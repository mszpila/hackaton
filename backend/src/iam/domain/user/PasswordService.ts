import { Injectable } from '@nestjs/common';
import { User, UserPassword } from './User';

@Injectable()
export abstract class PasswordService {
  public abstract encryptPassword(rawPassword: UserPassword): Promise<UserPassword>;

  public abstract validatePassword(user: User, rawPassword: UserPassword): Promise<void>;
}
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PasswordService } from '../../domain/user/PasswordService';
import { User, UserPassword } from '../../domain/user/User';

export class BcryptPasswordService implements PasswordService {
  public async encryptPassword(rawPassword: UserPassword): Promise<UserPassword> {
    const salt = await bcrypt.genSalt(Number.parseInt(process.env.BCRYPT_SALT!));
    const hash = await bcrypt.hash(rawPassword.toString(), salt);

    return new UserPassword(hash);
  }

  public async validatePassword(user: User, rawPassword: UserPassword): Promise<void> {
    const valid = await bcrypt.compare(rawPassword.toString(), user.getHashedPassword().toString());

    if (!valid) {
      throw new BadRequestException('Wrong credentials');
    }
  }
}
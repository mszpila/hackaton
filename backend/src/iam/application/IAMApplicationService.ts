import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenID } from '../domain/token/Token';
import { TokenFactory } from '../domain/token/TokenFactory';
import { TokenRepository } from '../domain/token/TokenRepository';
import { PasswordService } from '../domain/user/PasswordService';
import { User, UserEmail, UserID, Username, UserPassword, UserRole } from '../domain/user/User';
import { UserRepository } from '../domain/user/UserRepository';
import { LoginCommand } from './commands/LoginCommand';
import { SignUpCommand } from './commands/SignUpCommand';
import { TokenCommand } from './commands/TokenCommand';
import { TokenDTO } from './TokenDTO';

@Injectable()
export class IAMApplicationService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenFactory: TokenFactory,
    private readonly passwordService: PasswordService,
  ) {
  }

  public async login(command: LoginCommand): Promise<TokenDTO> {
    const user = await this.userRepository.findByEmail(new UserEmail(command.email));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.passwordService.validatePassword(user, new UserPassword(command.password));

    const token = this.tokenFactory.createToken(user.id);
    await this.tokenRepository.save(token);

    return new TokenDTO(token.toSnapshot(), user.toSnapshot());
  }

  public async logout(command: TokenCommand): Promise<void> {
    const fetchedToken = await this.tokenRepository.get(new TokenID(command.token));

    if (!fetchedToken) {
      throw new NotFoundException('Token not found');
    }

    fetchedToken.markAsExpired();

    await this.tokenRepository.save(fetchedToken);
  }

  public async singUp(command: SignUpCommand): Promise<TokenDTO> {
    const user = await this.userRepository.findByEmail(new UserEmail(command.email));

    if (user) {
      throw new NotFoundException('User already exists');
    }

    const newUser = new User(
      new UserID(),
      new Username(command.email),
      new UserEmail(command.email),
      await this.passwordService.encryptPassword(new UserPassword(command.password)),
      [UserRole.USER],
    );

    await this.userRepository.save(newUser);

    const token = this.tokenFactory.createToken(newUser.id);
    await this.tokenRepository.save(token);

    return new TokenDTO(token.toSnapshot(), newUser.toSnapshot());
  }
}
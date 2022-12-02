import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from '../user/User';
import { UserRepository } from '../user/UserRepository';
import { Token, TokenID } from './Token';
import { TokenRepository } from './TokenRepository';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
  ) {
  }

  public async assertTokenIsValid(tokenId: TokenID): Promise<Token> {
    const token = await this.tokenRepository.get(tokenId);

    if (!token) {
      throw new UnauthorizedException('Forbidden access');
    }

    if (token.expired()) {
      throw new UnauthorizedException('Token has expired');
    }

    token.extendByDay();
    await this.tokenRepository.save(token);

    return token;
  }

  public async getUser(tokenId: TokenID, userRole: UserRole | null): Promise<User> {
    const token = await this.assertTokenIsValid(tokenId);
    const user = await this.userRepository.get(token.getUser());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userRole && !user.hasRole(userRole)) {
      throw new UnauthorizedException('Forbidden access');
    }

    return user;
  }
}
import { Injectable } from '@nestjs/common';
import { UserID } from '../user/User';
import { Token, TokenID } from './Token';

@Injectable()
export class TokenFactory {
  public createToken(userId: UserID): Token {
    return new Token(
      new TokenID(),
      userId,
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    );
  }
}
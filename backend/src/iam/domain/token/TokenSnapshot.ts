import { DateValue } from '../../../shared';
import { UserID } from '../user/User';
import { Token, TokenID } from './Token';

export class TokenSnapshot {
  constructor(
    public readonly id: string,
    public readonly user: string,
    public readonly expireDate: string | null,
  ) {
  }

  public static toEntity(snapshot: TokenSnapshot): Token {
    return new Token(
      new TokenID(snapshot.id),
      new UserID(snapshot.user),
      new DateValue(snapshot.expireDate),
    );
  }
}
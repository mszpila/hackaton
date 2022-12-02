import { DateValue, Entity, Identifier } from '../../../shared';
import { UserID } from '../user/User';
import { TokenSnapshot } from './TokenSnapshot';

export class TokenID extends Identifier {
}

export class Token extends Entity<TokenID, TokenSnapshot> {
  constructor(
    id: TokenID,
    private user: UserID,
    private expireDate: DateValue,
  ) {
    super(id);
  }

  public toSnapshot(): TokenSnapshot {
    return new TokenSnapshot(
      this.id.toString(),
      this.user.toString(),
      this.expireDate.toISOStringOrNull(),
    );
  }

  public expired(): boolean {
    return this.expireDate.hasAlreadyPassed();
  }

  public extendByDay(): void {
    this.expireDate = new DateValue(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  }

  public getUser(): UserID {
    return this.user;
  }

  public markAsExpired(): void {
    this.expireDate = new DateValue(new Date());
  }
}

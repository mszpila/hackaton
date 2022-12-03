import { Entity, Identifier } from '../../../shared';
import { UserID } from '../user/User';
import { TokenSnapshot } from './TokenSnapshot';

export class TokenID extends Identifier {
}

export class Token extends Entity<TokenID, TokenSnapshot> {
  constructor(
    id: TokenID,
    private user: UserID,
    private expireDate: Date | null,
  ) {
    super(id);
  }

  public toSnapshot(): TokenSnapshot {
    return new TokenSnapshot(
      this.id.toString(),
      this.user.toString(),
      this.expireDate ? this.expireDate.toISOString() : null,
    );
  }

  public expired(): boolean {
    if (!this.expireDate) {
      return false;
    }

    return this.expireDate.getTime() < new Date().getTime() ? true : false;
  }

  public extendByDay(): void {
    this.expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  }

  public getUser(): UserID {
    return this.user;
  }

  public markAsExpired(): void {
    this.expireDate = new Date();
  }
}

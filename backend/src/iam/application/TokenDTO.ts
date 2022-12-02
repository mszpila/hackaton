import { TokenSnapshot } from '../domain/token/TokenSnapshot';
import { UserSnapshot } from '../domain/user/UserSnapshot';

export class TokenDTO {
  public readonly token: string;
  public readonly user: string;
  public readonly roles: string[];

  constructor(token: TokenSnapshot, user: UserSnapshot) {
    this.token = token.id;
    this.user = user.id;
    this.roles = user.roles;
  }
}
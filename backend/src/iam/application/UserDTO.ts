import { User } from '../domain/user/User';

export class UserDTO {
  public readonly id: string;
  public readonly email: string;
  public readonly roles: string[];

  constructor(user: User) {
    const snap = user.toSnapshot();

    this.id = snap.id;
    this.email = snap.email;
    this.roles = snap.roles;
  }
}
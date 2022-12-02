import { User, UserEmail, UserID, Username, UserPassword, UserRole } from './User';

export class UserSnapshot {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roles: string[],
  ) {
  }

  public static toEntity(snapshot: UserSnapshot): User {
    return new User(
      new UserID(snapshot.id),
      new Username(snapshot.username),
      new UserEmail(snapshot.email),
      new UserPassword(snapshot.password),
      snapshot.roles.map(role => new UserRole(role)),
    );
  }
}
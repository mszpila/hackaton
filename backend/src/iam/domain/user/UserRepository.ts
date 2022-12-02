import { User, UserEmail, UserID, Username } from './User';

export abstract class UserRepository {
  public abstract save(user: User): Promise<void>;

  public abstract get(userId: UserID): Promise<User | null>;

  public abstract findByEmail(email: UserEmail): Promise<User | null>;

  public abstract findByUsername(username: Username): Promise<User | null>;
}
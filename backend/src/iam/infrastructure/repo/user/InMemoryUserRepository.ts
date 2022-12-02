import { User, UserEmail, UserID, Username } from '../../../domain/user/User';
import { UserRepository } from '../../../domain/user/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  public async get(userId: UserID): Promise<User | null> {
    return Promise.resolve(null);
  }

  public async save(user: User): Promise<void> {
    return Promise.resolve(undefined);
  }

  public findByEmail(email: UserEmail): Promise<User | null> {
    return Promise.resolve(null);
  }

  public findByUsername(username: Username): Promise<User | null> {
    return Promise.resolve(null);
  }
}
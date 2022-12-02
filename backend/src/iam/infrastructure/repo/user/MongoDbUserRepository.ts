import { Inject } from '@nestjs/common';
import { Connection, Document, Schema } from 'mongoose';
import { MongoDbConnection } from '../../../../shared/infrastructure/MongoDbConnection';
import { MongoDbModelProxy } from '../../../../shared/infrastructure/MongoDbModelProxy';
import { MongoDbTranslator } from '../../../../shared/infrastructure/MongoDbTranslator';
import { User, UserEmail, UserID, Username, UserPassword, UserRole } from '../../../domain/user/User';
import { UserRepository } from '../../../domain/user/UserRepository';
import { UserSnapshot } from '../../../domain/user/UserSnapshot';

interface IUserModel extends Document, UserSnapshot {
  id: string;
  version: number;
}

export class MongoDbUserRepository implements UserRepository {
  private readonly model: MongoDbModelProxy<IUserModel, UserSnapshot, UserID, User>;
  private readonly collectionName = 'users';

  constructor(
    @Inject(MongoDbConnection) private readonly db: Connection,
  ) {
    const userSchema = new Schema<IUserModel>({
      _id: {
        type: Schema.Types.ObjectId,
        alias: 'id',
      },
      username: Schema.Types.String,
      email: Schema.Types.String,
      password: Schema.Types.String,
      roles: [Schema.Types.String],
    }, { versionKey: 'version' });

    const model = this.db.model('User', userSchema, this.collectionName);
    this.model = new MongoDbModelProxy(model, new UserTranslator());
  }

  public async get(userId: UserID): Promise<User | null> {
    return this.model.findById(userId.toObjectID());
  }

  public async save(user: User): Promise<void> {
    await this.model.save(user);
  }

  public findByEmail(email: UserEmail): Promise<User | null> {
    return this.model.findOne({
      email: email.toString(),
    });
  }

  public findByUsername(username: Username): Promise<User | null> {
    return this.model.findOne({
      username: username.toString(),
    });
  }
}

class UserTranslator implements MongoDbTranslator<User, UserSnapshot> {
  public toEntity(plainObject: IUserModel): User {
    return new User(
      new UserID(plainObject._id),
      new Username(plainObject.username),
      new UserEmail(plainObject.email),
      new UserPassword(plainObject.password),
      plainObject.roles.map(role => new UserRole(role)),
    );
  }

  public toSnapshot(entity: User): UserSnapshot {
    return entity.toSnapshot();
  }
}
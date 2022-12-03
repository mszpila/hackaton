import { Inject } from '@nestjs/common';
import { Connection, Document, Model, Schema } from 'mongoose';
import { MongoDbConnection } from '../../../../shared/infrastructure/MongoDbConnection';
import { MongoDbTranslator } from '../../../../shared/infrastructure/MongoDbTranslator';
import { User, UserEmail, UserID, Username, UserPassword, UserRole } from '../../../domain/user/User';
import { UserRepository } from '../../../domain/user/UserRepository';
import { UserSnapshot } from '../../../domain/user/UserSnapshot';

interface IUserModel extends Document, UserSnapshot {
  id: string;
  version: number;
}

export class MongoDbUserRepository implements UserRepository {
  private readonly model: Model<IUserModel>;
  private readonly collectionName = 'users';
  private readonly translator = new UserTranslator();

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

    this.model = this.db.model('User', userSchema, this.collectionName);
  }

  public async get(userId: UserID): Promise<User | null> {
    const user = await this.model.findById(userId.toObjectID());

    if (!user) {
      return null;
    }

    return this.translator.toEntity(user);
  }

  public async save(user: User): Promise<void> {
    await this.model.updateOne(
      { _id: user.id.toObjectID() },
      { ...user.toSnapshot() },
      { upsert: true },
    );
  }

  public async findByEmail(email: UserEmail): Promise<User | null> {
    const user = await this.model.findOne({
      email: email.toString(),
    });

    if (!user) {
      return null;
    }

    return this.translator.toEntity(user);
  }

  public async findByUsername(username: Username): Promise<User | null> {
    const user = await this.model.findOne({
      username: username.toString(),
    });

    if (!user) {
      return null;
    }

    return this.translator.toEntity(user);
  }
}

class UserTranslator implements MongoDbTranslator<User, UserSnapshot> {
  public toEntity(plainObject: IUserModel): User {
    return new User(
      new UserID(plainObject._id),
      new Username(plainObject.username),
      new UserEmail(plainObject.email),
      new UserPassword(plainObject.password),
      plainObject.roles as UserRole[],
    );
  }

  public toSnapshot(entity: User): UserSnapshot {
    return entity.toSnapshot();
  }
}
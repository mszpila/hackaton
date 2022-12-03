import { Inject } from '@nestjs/common';
import { Connection, Document, Model, Schema } from 'mongoose';
import { MongoDbConnection } from '../../../../shared/infrastructure/MongoDbConnection';
import { MongoDbTranslator } from '../../../../shared/infrastructure/MongoDbTranslator';
import { Token, TokenID } from '../../../domain/token/Token';
import { TokenRepository } from '../../../domain/token/TokenRepository';
import { TokenSnapshot } from '../../../domain/token/TokenSnapshot';
import { UserID } from '../../../domain/user/User';

interface ITokenModel extends Document, TokenSnapshot {
  id: string;
}

export class MongoDbTokenRepository implements TokenRepository {
  private readonly model: Model<ITokenModel>;
  private readonly collectionName = 'tokens';
  private readonly translator = new TokenTranslator();

  constructor(
    @Inject(MongoDbConnection) private readonly db: Connection,
  ) {
    const tokenSchema = new Schema<ITokenModel>({
      _id: {
        type: Schema.Types.ObjectId,
        alias: 'id',
      },
      user: Schema.Types.ObjectId,
      expireDate: Schema.Types.Date,
    }, { versionKey: false });

    this.model = this.db.model('Token', tokenSchema, this.collectionName);
  }

  public async get(tokenId: TokenID): Promise<Token | null> {
    const token = await this.model.findById(tokenId.toObjectID());

    if (!token) {
      return null;
    }

    return this.translator.toEntity(token);
  }

  public async save(token: Token): Promise<void> {
    await this.model.updateOne(
      { _id: token.id.toObjectID() },
      { ...token.toSnapshot() },
      { upsert: true },
    );
  }
}

class TokenTranslator implements MongoDbTranslator<Token, TokenSnapshot> {
  public toEntity(plainObject: ITokenModel): Token {
    return new Token(
      new TokenID(plainObject._id),
      new UserID(plainObject.user),
      plainObject.expireDate ? new Date(plainObject.expireDate) : null,
    );
  }

  public toSnapshot(entity: Token): TokenSnapshot {
    return entity.toSnapshot();
  }
}
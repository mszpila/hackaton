import { Inject } from '@nestjs/common';
import { Connection, Document, Schema } from 'mongoose';
import { DateValue } from '../../../../shared';
import { MongoDbConnection } from '../../../../shared/infrastructure/MongoDbConnection';
import { MongoDbModelProxy } from '../../../../shared/infrastructure/MongoDbModelProxy';
import { MongoDbTranslator } from '../../../../shared/infrastructure/MongoDbTranslator';
import { Token, TokenID } from '../../../domain/token/Token';
import { TokenRepository } from '../../../domain/token/TokenRepository';
import { TokenSnapshot } from '../../../domain/token/TokenSnapshot';
import { UserID } from '../../../domain/user/User';

interface ITokenModel extends Document, TokenSnapshot {
  id: string;
}

export class MongoDbTokenRepository implements TokenRepository {
  private readonly model: MongoDbModelProxy<ITokenModel, TokenSnapshot, TokenID, Token>;
  private readonly collectionName = 'tokens';

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

    const model = this.db.model('Token', tokenSchema, this.collectionName);
    this.model = new MongoDbModelProxy(model, new TokenTranslator());
  }

  public async get(tokenId: TokenID): Promise<Token | null> {
    return this.model.findById(tokenId.toObjectID());
  }

  public async save(token: Token): Promise<void> {
    return this.model.save(token);
  }
}

class TokenTranslator implements MongoDbTranslator<Token, TokenSnapshot> {
  public toEntity(plainObject: ITokenModel): Token {
    return new Token(
      new TokenID(plainObject._id),
      new UserID(plainObject.user),
      new DateValue(plainObject.expireDate),
    );
  }

  public toSnapshot(entity: Token): TokenSnapshot {
    return entity.toSnapshot();
  }
}
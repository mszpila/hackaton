import { Injectable } from '@nestjs/common';
import { Token, TokenID } from './Token';

@Injectable()
export abstract class TokenRepository {
  public abstract save(token: Token): Promise<void>;

  public abstract get(tokenId: TokenID): Promise<Token | null>;
}
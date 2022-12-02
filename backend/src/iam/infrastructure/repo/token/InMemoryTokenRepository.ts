import { Token, TokenID } from '../../../domain/token/Token';
import { TokenRepository } from '../../../domain/token/TokenRepository';

export class InMemoryTokenRepository implements TokenRepository {
  public async get(tokenId: TokenID): Promise<Token | null> {
    return Promise.resolve(null);
  }

  public async save(token: Token): Promise<void> {
    return Promise.resolve(undefined);
  }
}
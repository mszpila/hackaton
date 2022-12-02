import { Injectable } from '@nestjs/common';
import { TokenID } from '../domain/token/Token';
import { TokenService } from '../domain/token/TokenService';
import { GetUserCommand } from './commands/GetUserCommand';
import { UserDTO } from './UserDTO';

@Injectable()
export class UserApplicationService {
  constructor(
    private readonly tokenService: TokenService,
  ) {
  }

  public async getUser(command: GetUserCommand): Promise<UserDTO> {
    const token = new TokenID(command.token);
    const user = await this.tokenService.getUser(token, null);

    return new UserDTO(user);
  }
}
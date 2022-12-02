import { IsString } from '@nestjs/class-validator';
import { TokenCommand } from './TokenCommand';

export class GetUserCommand extends TokenCommand {
  @IsString()
  public readonly user: string;
}
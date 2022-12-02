import { IsString } from '@nestjs/class-validator';

export class TokenCommand {
  @IsString()
  public readonly token: string;
}
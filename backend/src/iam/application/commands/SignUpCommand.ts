import { IsArray, IsString } from '@nestjs/class-validator';
import { LoginCommand } from './LoginCommand';

export class SignUpCommand extends LoginCommand {
  @IsString()
  public readonly firstName: string;

  @IsString()
  public readonly lastName: string;
}
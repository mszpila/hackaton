import { IsEmail, IsString } from '@nestjs/class-validator';

export class LoginCommand {
  // @IsString()
  // public readonly username: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
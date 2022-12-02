import { UnprocessableEntityException } from '@nestjs/common';
import { Entity, Enum, Identifier } from '../../../shared';

import { UserSnapshot } from './UserSnapshot';

export class UserID extends Identifier {
}

@Enum.decorate()
export class UserRole extends Enum {
  public static readonly USER = new UserRole('USER');
  public static readonly ADMIN = new UserRole('ADMIN');
}

export class UserEmail {
  constructor(private readonly email: string) {
    if (!email || !email.length) {
      throw new UnprocessableEntityException('Email cannot be empty');
    }
  }

  public toString(): string {
    return this.email;
  }
}

export class Username {
  constructor(
    private readonly username: string,
  ) {
    if (!username || !username.length) {
      throw new UnprocessableEntityException('Username cannot be empty');
    }
  }

  public toString(): string {
    return this.username;
  }
}

export class UserPassword {
  constructor(private readonly password: string) {
    if (!password || !password.length) {
      throw new UnprocessableEntityException('Password cannot be empty');
    }
  }

  public toString(): string {
    return this.password;
  }
}

export class User extends Entity<UserID, UserSnapshot> {
  constructor(
    id: UserID,
    private username: Username,
    private email: UserEmail,
    private password: UserPassword,
    private roles: UserRole[],
  ) {
    super(id);
  }

  public toSnapshot(): UserSnapshot {
    return new UserSnapshot(
      this.id.toString(),
      this.username.toString(),
      this.email.toString(),
      this.password.toString(),
      this.roles.map(role => role.toString()),
    );
  }

  public isAdmin(): boolean {
    return !!this.roles.find(role => role.equals(UserRole.ADMIN));
  }

  public isUser(): boolean {
    return !!this.roles.find(role => role.equals(UserRole.USER));
  }

  public hasRole(userRole: UserRole): boolean {
    return !!this.roles.find(role => role.equals(userRole));
  }

  public getHashedPassword(): UserPassword {
    return this.password;
  }
}

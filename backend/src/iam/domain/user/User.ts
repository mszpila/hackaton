import { UnprocessableEntityException } from '@nestjs/common';
import { Entity, Identifier } from '../../../shared';

import { UserSnapshot } from './UserSnapshot';

export class UserID extends Identifier {
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
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
    return !!this.roles.find(role => role.toString() === UserRole.ADMIN.toString());
  }

  public isUser(): boolean {
    return !!this.roles.find(role => role.toString() === UserRole.USER.toString());
  }

  public hasRole(userRole: UserRole): boolean {
    return !!this.roles.find(role => role.toString() === userRole.toString());
  }

  public getHashedPassword(): UserPassword {
    return this.password;
  }
}

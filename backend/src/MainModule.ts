import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BunyanLoggerModule } from 'nestjs-bunyan';
import { FoodController } from './food/infrastructure/api/FoodController';
import { IAMApplicationService } from './iam/application/IAMApplicationService';
import { UserApplicationService } from './iam/application/UserApplicationService';
import { TokenFactory } from './iam/domain/token/TokenFactory';
import { TokenRepository } from './iam/domain/token/TokenRepository';
import { TokenService } from './iam/domain/token/TokenService';
import { PasswordService } from './iam/domain/user/PasswordService';
import { UserRepository } from './iam/domain/user/UserRepository';
import { IAMController } from './iam/infrastructure/api/IAMController';
import { UserController } from './iam/infrastructure/api/UserController';
import { InMemoryTokenRepository } from './iam/infrastructure/repo/token/InMemoryTokenRepository';
import { MongoDbTokenRepository } from './iam/infrastructure/repo/token/MongoDbTokenRepository';
import { InMemoryUserRepository } from './iam/infrastructure/repo/user/InMemoryUserRepository';
import { MongoDbUserRepository } from './iam/infrastructure/repo/user/MongoDbUserRepository';
import { BcryptPasswordService } from './iam/infrastructure/service/BcryptPasswordService';
import { establishMongoDbConnection, MongoDbConnection } from './shared/infrastructure/MongoDbConnection';

@Module({
  imports: [
    EventEmitterModule.forRoot({}),
    ConfigModule.forRoot(),
    BunyanLoggerModule.forRoot({
      isGlobal: true,
      isEnableRequestLogger: true,
      bunyan: {
        name: 'some awesome app',
      },
    }),
  ],

  controllers: [
    // iam
    IAMController,
    UserController,

    // food
    FoodController,
  ],

  providers: [
    // shared
    {
      provide: MongoDbConnection,
      useFactory: async () => await establishMongoDbConnection({ dbName: process.env.DB_NAME }),
    },

    IAMApplicationService,
    UserApplicationService,

    { provide: TokenRepository, useClass: process.env.TEST ? InMemoryTokenRepository : MongoDbTokenRepository },
    TokenFactory,
    TokenService,

    { provide: UserRepository, useClass: process.env.TEST ? InMemoryUserRepository : MongoDbUserRepository },
    { provide: PasswordService, useClass: BcryptPasswordService },
  ],
})

export class MainModule {
}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BunyanLoggerModule } from 'nestjs-bunyan';
import { WeeklyPlanApplicationService } from './food/application/WeeklyPlanApplicationService';
import { FoodService } from './food/domain/FoodService';
import { WeeklyPlanRepository } from './food/domain/weeklyPlan/WeeklyPlanRepository';
import { WeeklyPlanService } from './food/domain/weeklyPlan/WeeklyPlanService';
import { WeeklyPlanController } from './food/infrastructure/api/WeeklyPlanController';
import { MongoDbWeeklyPlanRepository } from './food/infrastructure/repo/MongoDbWeeklyPlanRepository';
import { DummyFoodService } from './food/infrastructure/services/DummyFoodService';
import { SpoonacularFoodService } from './food/infrastructure/services/SpoonacularFoodService';
import { IAMApplicationService } from './iam/application/IAMApplicationService';
import { UserApplicationService } from './iam/application/UserApplicationService';
import { TokenFactory } from './iam/domain/token/TokenFactory';
import { TokenRepository } from './iam/domain/token/TokenRepository';
import { TokenService } from './iam/domain/token/TokenService';
import { PasswordService } from './iam/domain/user/PasswordService';
import { UserRepository } from './iam/domain/user/UserRepository';
import { IAMController } from './iam/infrastructure/api/IAMController';
import { UserController } from './iam/infrastructure/api/UserController';
import { MongoDbTokenRepository } from './iam/infrastructure/repo/token/MongoDbTokenRepository';
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
    WeeklyPlanController,
  ],

  providers: [
    // shared
    {
      provide: MongoDbConnection,
      useFactory: async () => await establishMongoDbConnection({ dbName: process.env.DB_NAME }),
    },

    // app
    IAMApplicationService,
    UserApplicationService,
    WeeklyPlanApplicationService,

    // domain
    {
      provide: FoodService,
      useClass: process.env.TEST ? DummyFoodService : SpoonacularFoodService,
    },

    { provide: TokenRepository, useClass: MongoDbTokenRepository },
    TokenFactory,
    TokenService,

    { provide: UserRepository, useClass: MongoDbUserRepository },
    { provide: PasswordService, useClass: BcryptPasswordService },

    WeeklyPlanService,
    {
      provide: WeeklyPlanRepository,
      useClass: MongoDbWeeklyPlanRepository,
    },
  ],
})

export class MainModule {
}
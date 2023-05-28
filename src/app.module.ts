import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma';
import { UserModule } from './models/user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthenticationModule } from './models/authentication/authentication.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './models/authentication/jwt-auth.guard';
import { CategoryModule } from './models/category/category.module';
import { CompetitionModule } from './models/competition/competition.module';
import { TeamModule } from './models/team/team.module';
import { PlayerModule } from './models/player/player.module';
import { ImagesModule } from './models/images/images.module';
import patch from './common/patch';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1000,
    }),
    PrismaModule,
    UserModule,
    AuthenticationModule,
    CategoryModule,
    CompetitionModule,
    TeamModule,
    PlayerModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    patch();
  }
}

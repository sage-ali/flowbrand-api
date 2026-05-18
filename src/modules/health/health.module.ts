import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '../redis/redis.module';
import { HealthController } from './health.controller';
import { HEALTH_RATE_LIMIT } from './health.constants';

@Module({
  imports: [
    ThrottlerModule.forRoot([HEALTH_RATE_LIMIT]),
    RedisModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}

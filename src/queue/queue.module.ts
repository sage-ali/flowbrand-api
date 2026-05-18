import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('redis.host') || 'localhost',
          port: config.get<number>('redis.port') ?? 6379,
          password: config.get<string>('redis.password') || undefined,
          username: config.get<string>('redis.username') || undefined,
          ...(config.get<boolean>('redis.tls') && { tls: {} }),
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
          retryStrategy: (times: number) => {
            if (times > 10) return null; // give up after 10 retries
            if (times <= 3) return 1000; // first 3 retries: 1s apart
            const jitter = Math.floor(Math.random() * 2000);
            return Math.min(times * 1000, 10_000) + jitter;
          },
        },
        prefix: 'seil:bull',
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}

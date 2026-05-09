import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENV_KEYS } from './constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>(ENV_KEYS.DATABASE_URL),
        autoLoadEntities: true,
        synchronize: config.get<string>(ENV_KEYS.NODE_ENV) !== 'production',
        logging: config.get<string>(ENV_KEYS.NODE_ENV) === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}

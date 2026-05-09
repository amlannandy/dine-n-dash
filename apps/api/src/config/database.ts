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
        host: config.getOrThrow<string>(ENV_KEYS.DB_HOST),
        port: config.getOrThrow<number>(ENV_KEYS.DB_PORT),
        username: config.getOrThrow<string>(ENV_KEYS.DB_USERNAME),
        password: config.getOrThrow<string>(ENV_KEYS.DB_PASSWORD),
        database: config.getOrThrow<string>(ENV_KEYS.DB_DATABASE),
        autoLoadEntities: true,
        synchronize: config.get<string>(ENV_KEYS.NODE_ENV) !== 'production',
        logging: config.get<string>(ENV_KEYS.NODE_ENV) === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}

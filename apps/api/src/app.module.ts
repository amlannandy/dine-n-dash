import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/config/database';
import { ConfigModule } from '@/config/environment';

@Module({
  imports: [ConfigModule, DatabaseModule],
})
export class AppModule {}

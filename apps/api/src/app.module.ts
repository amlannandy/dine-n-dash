import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/config/database';
import { ConfigModule } from '@/config/environment';
import { RestaurantsModule } from '@/restaurants/restaurants.module';

@Module({
  imports: [ConfigModule, DatabaseModule, RestaurantsModule],
})
export class AppModule {}

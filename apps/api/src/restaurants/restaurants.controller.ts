import { Restaurant } from '@dine-n-dash/types';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurants.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly service: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant registered, pending admin approval' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  create(@Body() dto: CreateRestaurantDto): Promise<Restaurant> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant details' })
  @ApiResponse({ status: 200, description: 'Restaurant updated' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto): Promise<Restaurant> {
    return this.service.update(id, dto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a restaurant (admin)' })
  @ApiResponse({ status: 200, description: 'Restaurant approved' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  approve(@Param('id') id: string): Promise<Restaurant> {
    return this.service.approve(id);
  }

  @Patch(':id/suspend')
  @ApiOperation({ summary: 'Suspend a restaurant (admin)' })
  @ApiResponse({ status: 200, description: 'Restaurant suspended' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  suspend(@Param('id') id: string): Promise<Restaurant> {
    return this.service.suspend(id);
  }
}

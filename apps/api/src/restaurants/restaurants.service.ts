import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RestaurantEntity } from './restaurants.entity';

import type { CreateRestaurantDto, UpdateRestaurantDto } from './restaurants.dto';
import type { Restaurant } from '@dine-n-dash/types';
import type { Repository } from 'typeorm';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly repo: Repository<RestaurantEntity>,
  ) {}

  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    const existing = await this.repo.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('A restaurant with this email already exists');

    const restaurant = this.repo.create({ ...dto, status: 'pending', subscriptionPlan: 'basic' });
    return this.toResponse(await this.repo.save(restaurant));
  }

  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.repo.find();
    return restaurants.map((r) => this.toResponse(r));
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.repo.findOneBy({ id });
    if (!restaurant) throw new NotFoundException(`Restaurant with id ${id} not found`);
    return this.toResponse(restaurant);
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.repo.findOneBy({ id });
    if (!restaurant) throw new NotFoundException(`Restaurant with id ${id} not found`);

    return this.toResponse(await this.repo.save({ ...restaurant, ...dto }));
  }

  async approve(id: string): Promise<Restaurant> {
    return this.setStatus(id, 'approved');
  }

  async suspend(id: string): Promise<Restaurant> {
    return this.setStatus(id, 'suspended');
  }

  private async setStatus(id: string, status: Restaurant['status']): Promise<Restaurant> {
    const restaurant = await this.repo.findOneBy({ id });
    if (!restaurant) throw new NotFoundException(`Restaurant with id ${id} not found`);
    return this.toResponse(await this.repo.save({ ...restaurant, status }));
  }

  private toResponse(entity: RestaurantEntity): Restaurant {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      phone: entity.phone,
      email: entity.email,
      logoUrl: entity.logoUrl,
      status: entity.status,
      subscriptionPlan: entity.subscriptionPlan,
      subscriptionExpiresAt: entity.subscriptionExpiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

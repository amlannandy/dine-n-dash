import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Restaurant, RestaurantStatus, SubscriptionPlan } from '@dine-n-dash/types';

@Entity('restaurants')
export class RestaurantEntity implements Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: RestaurantStatus;

  @Column({ type: 'varchar', default: 'basic' })
  subscriptionPlan: SubscriptionPlan;

  @Column({ type: 'timestamptz', nullable: true })
  subscriptionExpiresAt?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}

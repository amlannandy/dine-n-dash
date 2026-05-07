export type RestaurantStatus = 'pending' | 'approved' | 'suspended';

export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  status: RestaurantStatus;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  capacity: number;
  qrCode: string;
  isOccupied: boolean;
  createdAt: string;
}

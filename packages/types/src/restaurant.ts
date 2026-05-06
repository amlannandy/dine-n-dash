export enum RestaurantStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SUSPENDED = 'suspended',
}

export enum SubscriptionPlan {
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

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

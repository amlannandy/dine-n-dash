export type RestaurantStatus = 'pending' | 'approved' | 'suspended';

export type SubscriptionPlan = 'basic' | 'pro';

export interface Restaurant {
  id: string;
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

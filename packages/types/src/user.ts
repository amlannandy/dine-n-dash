export enum UserRole {
  ADMIN = 'admin',
  PARTNER = 'partner',
  CUSTOMER = 'customer',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

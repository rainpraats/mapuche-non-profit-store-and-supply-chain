export interface User {
  name: string;
  role: 'customer' | 'admin' | 'volunteer' | 'supplier' | 'delivery';
  memberSince: Date;
  password?: string;
}

export interface Credentials {
  name: string;
  role: 'customer' | 'admin' | 'volunteer' | 'supplier' | 'delivery';
  password: string;
}

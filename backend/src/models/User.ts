import { userRoles } from './userRoles';

export interface User {
  name: string;
  role: userRoles;
  password: string;
}

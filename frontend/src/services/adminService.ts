import { type Credentials } from '../interfaces/credentials';

export class AdminService {
  async createUser({ name, role, password }: Credentials) {
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role, password }),
      });

      const { success } = await response.json();
      return success;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

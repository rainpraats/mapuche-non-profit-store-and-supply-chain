import { type Credentials } from '../interfaces/credentials';

export class AdminService {
  async createUser({ name, role, password }: Credentials) {
    // const token = localStorage.getItem('JWT');

    // if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/v1/admin', {
        method: 'POST',
        headers: {
          // authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role, password }),
      });

      // const { success } = await response.json();
      // return success;
      const res = await response.json();
      console.log(res);
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data } = await response.json();
      return data.users;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

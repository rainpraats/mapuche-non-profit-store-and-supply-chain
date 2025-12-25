import { type Credentials } from '../interfaces/credentials';
import type { User } from '../interfaces/user';
import API_BASE_URL from '../config/api';

export class AdminService {
  async createUser({ name, role, password }: Credentials) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role, password }),
      });

      const { success } = await response.json();
      return success;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getUsers() {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const { data } = await response.json();
      return data.users;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteUser(name: string) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async editUser(username: string, updatedUser: User) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, updatedUser }),
      });

      if (response.ok) {
        const { success } = await response.json();
        return success;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

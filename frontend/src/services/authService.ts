import type { User } from '../interfaces/user';

export class AuthService {
  async getLoginToken({ name, password }: { name: string; password: string }) {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if (result.statusCode === 200) {
          return { token: result.data.token };
        }

        if (result.statusCode === 401) {
          return { message: 'Incorrect name or password.' };
        }
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getCurrentUser(): Promise<User | undefined> {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        return data.user;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteCurrentUser() {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

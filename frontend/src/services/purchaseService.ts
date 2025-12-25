import type { Item } from '../interfaces/Item';
import API_BASE_URL from '../config/api';

export class PurchaseService {
  async purchase(username: string, items: Item[]) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/purchase`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, items }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error: any) {
      console.error('Purchase error:', error);
      throw new Error(error.message || 'Purchase failed');
    }
  }
}

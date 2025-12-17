export class StockService {
  async listStock() {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/stock/`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        return data.stock;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

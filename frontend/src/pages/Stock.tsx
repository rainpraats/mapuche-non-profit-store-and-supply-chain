import { useEffect, useState } from 'react';
import { StockService } from '../services/stockService';
import type { Item } from '../interfaces/Item';
import { Link } from 'react-router';

const Stock = () => {
  const [stock, setStock] = useState<Item[]>([]);
  const [status, setStatus] = useState('Loading Stock');

  useEffect(() => {
    const fetchStock = async () => {
      const stockData = await new StockService().listStock();
      setStatus('');

      if (!stockData) {
        setStatus('Could not load stock. Try again later.');
        return;
      }

      if (stockData && stockData.length === 0) {
        setStatus('Stock is empty.');
        return;
      }

      setStock(stockData);
    };

    fetchStock();
  }, []);

  return (
    <main>
      <Link to="/">&#10094; go back</Link>
      {status && <p>{status}</p>}
      <ul>
        {stock.filter(item => item.quantity > 0).map((item, index) => (
          <li key={index}>
            <p>
              Item: {item.itemDescription} - Quantity: {item.quantity}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Stock;

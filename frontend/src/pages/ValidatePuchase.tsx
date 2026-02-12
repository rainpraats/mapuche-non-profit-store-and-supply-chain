import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { PurchaseService } from '../services/purchaseService';
import type { Item } from '../interfaces/Item';
import { ShoppingCartService } from '../services/shoppingCartService';

const ValidatePuchase = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('');
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const cart = params.get('cart');
  const user = params.get('user');

  if (!cart || !user) {
    setStatus('The purchase is missing or has malformed data.');
    return <p>{status}</p>;
  }

  const items: Item[] = JSON.parse(cart);

  const handlePurchase = async () => {
    setStatus('Processing...');
    try {
      await new PurchaseService().purchase(user, items);
      setPurchaseCompleted(true);
      new ShoppingCartService().clearCart();
    } catch (error) {
      console.error(error);
      setStatus('There was a problem processing the purchase.');
    }
  };

  if (purchaseCompleted) {
    return (
      <main>
        <p>Purchase successfully registered.</p>
        <Link to='/' className='go-back-to-previous-page'>
          &#10094; Go back to previous page
        </Link>
      </main>
    );
  } else {
    return (
      <main>
        {cart.length ? (
          <>
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <p>
                    Item: {item.itemDescription} - Quantity: {item.quantity}
                  </p>
                </li>
              ))}
            </ul>
            <button onClick={handlePurchase}>Confirm purchase</button>
            {status && <p>{status}</p>}
          </>
        ) : (
          <p>This cart is empty</p>
        )}
      </main>
    );
  }
};

export default ValidatePuchase;

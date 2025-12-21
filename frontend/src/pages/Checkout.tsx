import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import type { Item } from '../interfaces/Item';
import { ShoppingCartService } from '../services/shoppingCartService';
import type { User } from '../interfaces/user';
import { useOutletContext } from 'react-router';

const Checkout = () => {
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const [cart, setCart] = useState<Item[]>([]);

  useEffect(() => {
    const cartData = new ShoppingCartService().getCart();
    setCart(cartData);
  }, []);

  const clearCart = () => {
    new ShoppingCartService().clearCart();
    setCart([]);
  };

  return (
    <main>
      {cart.length ? (
        <>
          <QRCodeSVG
            value={`${
              window.location.origin
            }/validate-purchase/?cart=${JSON.stringify(cart)}&user=${
              signedInUser.name
            }`}
          />
          <button onClick={clearCart}>Remove items from cart</button>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <p>
                  Item: {item.itemDescription} - Quantity: {item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </main>
  );
};

export default Checkout;

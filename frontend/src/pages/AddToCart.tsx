import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ShoppingCartService } from '../services/shoppingCartService';

const AddToCart = () => {
  const [status, setStatus] = useState('');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const functionHasRan = useRef(false);

  useEffect(() => {
    if (functionHasRan.current) return;
    functionHasRan.current = true;

    const itemDescription = params.get('item');
    const quantity = params.get('quantity');
    if (!itemDescription || !quantity) {
      setStatus('Item or quantity are missing.');
      return;
    }
    const item = {
      itemDescription: itemDescription,
      quantity: parseInt(quantity),
    };
    new ShoppingCartService().addToCart(item);
    navigate('/checkout');
  }, [params]);

  return <main>{status && <p>{status}</p>}</main>;
};

export default AddToCart;

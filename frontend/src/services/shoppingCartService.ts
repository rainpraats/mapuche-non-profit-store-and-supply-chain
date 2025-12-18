import type { Item } from '../interfaces/Item';

export class ShoppingCartService {
  getCart(): Item[] {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart: Item[]): void {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }

  addToCart(item: Item): void {
    const cart = this.getCart();
    const existing = cart.find(
      (i) => i.itemDescription === item.itemDescription
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }

    this.saveCart(cart);
  }

  removeFromCart(itemDescription: string): void {
    let cart = this.getCart();
    cart = cart.filter((i) => i.itemDescription !== itemDescription);
    this.saveCart(cart);
  }

  clearCart(): void {
    const cart: Item[] = [];
    this.saveCart(cart);
  }
}

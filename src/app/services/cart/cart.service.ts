import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartList: any[] = [];
  constructor() {}

  addToCart(cartItem: any): void {
    this.cartList.push(cartItem);
  }

  showCart(): any[] {
    return this.cartList;
  }

  clearCart(): void {
    this.cartList = [];
  }
}

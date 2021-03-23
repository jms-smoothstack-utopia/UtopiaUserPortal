import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add to cart on #addToCart', () => {
    const fn = spyOn(service.cartList, 'push');

    service.addToCart('');

    expect(fn).toHaveBeenCalled();
  });

  it('should return cart list on #showCart', () => {
    service.addToCart('anything');
    const result = service.showCart();
    expect(result).toBeTruthy();
  });

  it('should clear cart on #clearCart', () => {
    service.clearCart();
    expect(service.cartList.length).toBe(0);
  });
});

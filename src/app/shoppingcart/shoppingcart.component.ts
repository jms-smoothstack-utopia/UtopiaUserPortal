import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css'],
})
export class ShoppingcartComponent implements OnInit {
  viewList: any[] = this.cart.showCart();

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    console.log(this.viewList);
  }
}

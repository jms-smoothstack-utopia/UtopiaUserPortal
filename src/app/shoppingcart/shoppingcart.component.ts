import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CartService } from "../services/cart/cart.service";
import { PurchaseTicketService } from '../services/purchase-ticket/purchase-ticket.service';
import { UserService } from '../services/user.service';
import { User } from '../user';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent implements OnInit {

  viewList: any[] = this.cart.showCart();

  constructor(
      private cart:CartService,
      private purchaseTicketService: PurchaseTicketService,
      private userService: UserService,
      private authService: AuthService,
      private log: NGXLogger,
    ) { }

  ngOnInit(): void {
    this.log.debug(this.viewList);
  }

  doPurchase(): void {
    //effectively checking if user is logged in here
    let userId: string = '';
    if (this.authService.userId !== undefined) {
      userId = this.authService.userId;
    }
    this.userService.getUser(userId).subscribe((res) => {
      if ((res as User).firstName !== undefined) {
        let userName: string = (res as User).firstName + ' ' + (res as User).lastName;
        this.purchaseTicketService.purchaseTickets(this.viewList, userName).subscribe(
          (res) => {
            //do something now that the purchase succeeded
            //prob. redirect to ticket upcoming view
          }
        )
      } else {
        //else fail due to no user name
        this.log.error(`FAIL in doPurchase(): no name for userId=${userId}`);
      }
    });
  }

}

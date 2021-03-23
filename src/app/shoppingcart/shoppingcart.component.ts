import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CartService } from "../services/cart/cart.service";
import { PurchaseTicketService } from '../services/purchase-ticket/purchase-ticket.service';
import { UserService } from '../services/user.service';
import { User } from '../user';
import PathConstants from 'src/environments/paths';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css'],
})
export class ShoppingcartComponent implements OnInit {
  viewList: any[] = this.cart.showCart();

  constructor(
      private cart:CartService,
      private purchaseTicketService: PurchaseTicketService,
      private userService: UserService,
      private authService: AuthService,
      private router: Router,
      private log: NGXLogger,
    ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.log.debug('Not logged in, redirecting to login screen.');
      this.router.navigate([PathConstants.LOGIN]);
    } else {
      this.log.debug(this.viewList);
    }
  }

  doPurchase(): void {
    let userId: string = '';
    if (this.authService.userId !== undefined) {
      userId = this.authService.userId;
    }
    this.userService.getUser(userId).subscribe((res) => {
      if ((res as User).firstName !== undefined) {
        let userName: string = (res as User).firstName + ' ' + (res as User).lastName;
        this.purchaseTicketService.purchaseTickets(this.viewList, userName).subscribe(
          (res) => {
            //redirect to upcoming flights so user can see their new tickets
            //or consider redirecting to the ticket detail view for a new ticket
            //and maybe a "Success!" splash page or modal
            this.router.navigate([PathConstants.FLIGHT_UPCOMING]);
          }
        )
      } else {
        //else fail due to no user name
        this.log.error(`FAIL in doPurchase(): no name for userId=${userId}`);
      }
    });
  }
}

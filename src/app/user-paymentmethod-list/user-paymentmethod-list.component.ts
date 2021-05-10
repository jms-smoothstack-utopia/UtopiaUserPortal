import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import PathConstants from 'src/environments/paths';
import { AuthService } from '../services/auth/auth.service';
import { PaymentMethodService } from '../services/payment-method/payment-method.service';
import { PaymentMethod } from '../paymentMethod'


@Component({
  selector: 'app-user-paymentmethod-list',
  templateUrl: './user-paymentmethod-list.component.html',
  styleUrls: ['./user-paymentmethod-list.component.css']
})
export class UserPaymentmethodListComponent implements OnInit {
  paymentMethods: PaymentMethod[] | undefined;
  error: HttpErrorResponse | undefined;
  activeForNav: string = 'payment';

    constructor(
    private authService: AuthService,
    private paymentMethodService: PaymentMethodService,
    private log: NGXLogger,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.log.debug('Not logged in, redirecting to login screen.');
      this.router.navigate([PathConstants.LOGIN]);
    } else {
      this.getPaymentMethods();
    }
  }

  getPaymentMethods(): void {
    const customerId = this.authService.userId;
    if (this.checkIsValidCustomerId(customerId)) {
      this.paymentMethodService
        .getAllPaymentMethodsForCustomer(customerId)
        .subscribe((tickets) => this.setPaymentMethods(tickets));
    }
  }

  setPaymentMethods(value: PaymentMethod[] | HttpErrorResponse | null): void {
    if (value === null) {
      this.paymentMethods = [];
    } else if (this.checkIsValidPaymentMethods(value)) {
      this.paymentMethods = value;
    } else if (this.checkIsError(value)) {
      this.error = value;
    }
  }

  checkIsValidCustomerId(customerId: string | undefined): customerId is string {
    return (customerId !== null && customerId !== undefined);
  }

  checkIsValidPaymentMethods(
    returnedValue: PaymentMethod[] | HttpErrorResponse | undefined
  ): returnedValue is PaymentMethod[] {
    if ((returnedValue as HttpErrorResponse).status !== undefined) {
      return false;
    } else if ((returnedValue as PaymentMethod[]).length == 0) {
      return true;
    }
    return (returnedValue as PaymentMethod[])[0].stripeId !== undefined;
  }
  
  checkIsError(returnedValue: any): returnedValue is HttpErrorResponse {
    return (returnedValue as HttpErrorResponse).status !== undefined;
  }

}

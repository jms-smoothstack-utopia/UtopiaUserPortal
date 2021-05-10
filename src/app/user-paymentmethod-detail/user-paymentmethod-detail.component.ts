import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import PathConstants from 'src/environments/paths';
import { PaymentMethod } from '../paymentMethod';
import { AuthService } from '../services/auth/auth.service';
import { PaymentMethodService } from '../services/payment-method/payment-method.service';

@Component({
  selector: 'app-user-paymentmethod-detail',
  templateUrl: './user-paymentmethod-detail.component.html',
  styleUrls: ['./user-paymentmethod-detail.component.css']
})
export class UserPaymentmethodDetailComponent implements OnInit {
  activeForNav: string = 'payment';
  showConfirmDelete: boolean = false;
  modalMsg?: string = undefined;
  paymentMethod: PaymentMethod | undefined;
  error: HttpErrorResponse | undefined;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private paymentMethodService: PaymentMethodService,
    private router: Router,
    private log: NGXLogger
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.log.debug('Not logged in, redirecting to login screen.');
      this.router.navigate([PathConstants.LOGIN]);
    } else {
      this.getPaymentMethod();
    }
  }

  getPaymentMethod(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    this.log.debug(`Got id: ${rawId}`);
    const customerId = this.authService.userId;
    if ((rawId !== null) && (customerId !== undefined)) {
      const paymentMethodId = +rawId;
      this.log.debug(`Resolved id: ${paymentMethodId}}`);
      this.paymentMethodService.getPaymentMethodById(customerId, paymentMethodId)
        .subscribe((myPaymentMethod) => this.setPaymentMethod(myPaymentMethod));
    }
  }

  setPaymentMethod(response: PaymentMethod | HttpErrorResponse): void {
    if (this.checkIsValidPaymentMethod(response)) {
      this.paymentMethod = response;
      this.log.debug(`Got payment method details for payment method ${response.stripeId}`)
    } else if (this.checkIsError(response)) {
      this.error = response;
    }
  }

  checkIsValidPaymentMethod(
    returnedValue: PaymentMethod | HttpErrorResponse | undefined
  ): returnedValue is PaymentMethod {
    return (returnedValue as PaymentMethod).stripeId !== undefined;
  }

  checkIsError(returnedValue: PaymentMethod | HttpErrorResponse | undefined
  ): returnedValue is HttpErrorResponse {
    return (returnedValue as HttpErrorResponse).message !== undefined;
  }

  onCloseAlert() {
    this.modalMsg = undefined;
  }

  back(): void {
    this.location.back();
  }

}

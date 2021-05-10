import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { PaymentMethodService } from '../services/payment-method/payment-method.service';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import PathConstants from 'src/environments/paths';

@Component({
  selector: 'app-user-paymentmethod-remove',
  templateUrl: './user-paymentmethod-remove.component.html',
  styleUrls: [
    '../shared/alert/alert.component.css',
    './user-paymentmethod-remove.component.css'
  ]
})
export class UserPaymentmethodRemoveComponent implements OnInit {
  @Input() paymentMethodId: number | undefined;
  @Output() closeEvent = new EventEmitter<void>();
  isLoading: boolean = false;
  removeConfirmed: boolean = false;
  errorMessage?: string;

  constructor(
    private authService: AuthService,
    private paymentMethodService: PaymentMethodService,
    private log: NGXLogger,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goBack(): void {
    if (this.removeConfirmed) {
      this.finishRemove();
    } else {
      this.removeConfirmed = false;
      this.errorMessage = undefined;
      this.isLoading = false;
      this.closeEvent.emit();
    }
  }

  finishRemove(): void {
    this.router.navigate([PathConstants.PAYMENT_METHODS_LIST]);
  }

  onRetryFromError(): void {
    this.errorMessage = undefined;
  }

  confirmRemove(): void {
    this.isLoading = true;
    const customerId = this.authService.userId;
    if ((this.paymentMethodId !== undefined) && (customerId !== undefined)) {
      this.paymentMethodService.removePaymentMethod(customerId, this.paymentMethodId).subscribe(
        (res) => {
          this.log.debug(`Removed payment method ${this.paymentMethodId} for ${customerId}`);
          this.isLoading = false;
          this.removeConfirmed = true;
        },
        (err) => {
          this.log.error('error in user-paymentmethod-remove:');
          this.log.error(err);
          this.isLoading = false;
          this.errorMessage = 'Removal of payment method failed, please try again later.';
        }
      );
    }
  }

}

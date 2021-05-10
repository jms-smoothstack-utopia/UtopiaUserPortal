import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import PathConstants from 'src/environments/paths';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cardNumberValidator, cvcValidator, expirationValidator } from '../utils/validators';
import { PaymentMethodService } from '../services/payment-method/payment-method.service'
import { AuthService } from '../services/auth/auth.service';
import { NGXLogger } from 'ngx-logger';
import { PaymentMethodDto } from '../paymentMethodDto';

@Component({
  selector: 'app-user-paymentmethod-add',
  templateUrl: './user-paymentmethod-add.component.html',
  styleUrls: ['./user-paymentmethod-add.component.css']
})
export class UserPaymentmethodAddComponent implements OnInit {
  activeForNav: string = 'payment';
  dto: PaymentMethodDto | undefined;
  isLoading: boolean = false;
  showResultModal: boolean = false;
  modalMsg?: string = undefined;
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years: number[] = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

  paymentMethodAddForm: FormGroup = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, cardNumberValidator]),
    expMonth: new FormControl('', [Validators.required]),
    expYear: new FormControl('', [Validators.required]),
    cvc: new FormControl('', [Validators.required, cvcValidator])
  }, { validators: expirationValidator });

  constructor(
    private paymentMethodService: PaymentMethodService,
    private authService: AuthService,
    private log: NGXLogger,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.log.debug('Not logged in, redirecting to login screen.');
      this.router.navigate([PathConstants.LOGIN]);
    }
  }

  submitForm(): void {
    this.buildDto();
    let customerId = this.authService.userId;
    if (this.checkIsValidCustomerId(customerId) && this.checkIsValidDto(this.dto)) {
      this.paymentMethodService.addPaymentMethod(customerId, this.dto)
        .subscribe((res) => {
          this.router.navigate([PathConstants.PAYMENT_METHODS_LIST]);
        },
        (err) => {
          //handle error
          this.modalMsg = "There was an error in adding your payment method. Please try another card, or try again later."
        });
    }
  }

  buildDto(): void {
    let newDto: PaymentMethodDto = {
      cardNumber: this.paymentMethodAddForm
                        .get('cardNumber')
                        ?.value,
      cvc: this.paymentMethodAddForm
                        .get('cvc')
                        ?.value,
      expMonth: this.paymentMethodAddForm
                        .get('expMonth')
                        ?.value,
      expYear: this.paymentMethodAddForm
                        .get('expYear')
                        ?.value,
      notes: ''
    };
    this.dto = newDto;
  }

  checkIsValidCustomerId(customerId: string | undefined): customerId is string {
    return (customerId as string) !== 'undefined';
  }

  checkIsValidDto(dto: PaymentMethodDto | undefined): dto is PaymentMethodDto {
    return (dto as PaymentMethodDto).cardNumber !== undefined;
  }

  onCloseAlert() {
    this.modalMsg = undefined;
  }

  showErrorForField(field: string) {
    const control = this.paymentMethodAddForm.get(field);
    return control && control.touched && control.invalid;
  }

  showExpirationError() {
    return this.paymentMethodAddForm.errors?.invalidExpiration && (this.paymentMethodAddForm.touched || this.paymentMethodAddForm.dirty);
  }

}

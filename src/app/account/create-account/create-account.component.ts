import { Component, OnInit } from '@angular/core';
import {
  AccountService,
  CreateCustomerAccountDto,
} from '../../services/account/account.service';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import PathConstants from '../../../environments/paths';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  trimStringLength,
  USPhoneNumberValidator,
} from '../../utils/validators';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import US_STATE_LIST from '../../services/us-state/us-states';

@Component({
  selector: 'app-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();
  isLoading = false;
  errorMsg?: string = undefined;
  states = US_STATE_LIST.map((s) => s.name);

  // 10-128 chars
  // at least 1 uppercase a-z
  // at least 1 lowercase a-z
  // at least one number
  // at least one special char
  readonly PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-_=+,.?])[A-Za-z\d!@#$%^&*-_=+,.?]{10,128}$/;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private log: NGXLogger
  ) {}

  accountForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required, trimStringLength(1)]),
    lastName: new FormControl('', [Validators.required, trimStringLength(1)]),
    addrLine1: new FormControl('', [Validators.required, trimStringLength(1)]),
    addrLine2: new FormControl(''),
    phoneNumber: new FormControl('', [
      Validators.required,
      USPhoneNumberValidator,
      Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/),
    ]),
    city: new FormControl('', [Validators.required, trimStringLength(1)]),
    state: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.PW_REGEX),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.log.debug('Already logged in.');
      this.router.navigate([PathConstants.USER_PROFILE]);
    }
  }

  onPhoneNumberFocusOut() {
    const phoneControl = this.accountForm.get('phoneNumber');
    if (phoneControl) {
      const number = this.phoneUtil.parse(phoneControl.value, 'US');
      const formatted = this.phoneUtil.format(
        number,
        PhoneNumberFormat.NATIONAL
      );
      if (phoneControl.value !== formatted) {
        phoneControl.patchValue(formatted);
      }
    }
  }

  // returns the phone number as ###-###-#### for persistence
  // or empty string if form not initialized
  get formattedPhoneNumber() {
    const control = this.accountForm.get('phoneNumber');
    if (control && control.valid) {
      const val = control.value.replaceAll(/\D/g, '');
      return val.slice(0, 3) + '-' + val.slice(3, 6) + '-' + val.slice(6, 11);
    }
    return '';
  }

  showErrorForField(field: string) {
    const control = this.accountForm.get(field);
    if (field === 'confirmPassword') {
      return this.invalidConfirmPassword;
    }
    return control && control.touched && control.invalid;
  }

  getFieldValue(field: string) {
    const control = this.accountForm.get(field);
    return control ? control.value.trim() : '';
  }

  get invalidConfirmPassword() {
    const password = this.accountForm.get('password');
    const confirmPassword = this.accountForm.get('confirmPassword');

    return (
      confirmPassword &&
      password &&
      confirmPassword.touched &&
      (password.value !== confirmPassword.value ||
        confirmPassword.value.length < 1)
    );
  }

  onSubmit() {
    if (!this.accountForm.valid) {
      return;
    }

    this.isLoading = true;

    const email = this.getFieldValue('email');
    const password = this.getFieldValue('password');

    const newAccount: CreateCustomerAccountDto = {
      email: email,
      password: password,
      firstName: this.getFieldValue('firstName'),
      lastName: this.getFieldValue('lastName'),
      phoneNumber: this.formattedPhoneNumber,
      addrLine1: this.getFieldValue('addrLine1'),
      addrLine2: this.getFieldValue('addrLine2'),
      city: this.getFieldValue('city'),
      state: this.selectedStateAbbreviation,
      zipcode: this.getFieldValue('zipcode'),
    };

    this.accountService.createAccount(newAccount).subscribe(
      (res) => {
        this.log.debug(res);
        this.isLoading = false;
        this.authService.login(email, password).subscribe(() => {
          this.router.navigate([PathConstants.USER_PROFILE, res.id]);
        });
      },
      (err) => {
        this.log.error(err);
        this.isLoading = false;
        if (err.status === 409) {
          // duplicate email
          this.errorMsg = 'An account with that email already exists.';
        } else {
          this.errorMsg =
            'There was a problem creating your profile.' +
            ' The code monkeys have been notified.' +
            ' Please try again!';
        }
      }
    );
  }

  get selectedStateAbbreviation() {
    const selection = this.getFieldValue('state');
    if (!!selection) {
      return US_STATE_LIST.filter((s) => s.name === selection).map(
        (s) => s.abbr
      )[0];
    }
    return '';
  }

  getErrorText(field: string) {
    switch (field) {
      case 'email':
        return 'Please enter a valid email.';
      case 'firstName':
        return 'Please enter your first name.';
      case 'lastName':
        return 'Please enter your last name.';
      case 'phoneNumber':
        return 'Please enter a valid phone number.';
      case 'addrLine1':
        return 'Please enter your street address.';
      case 'addrLine2':
        return '';
      case 'city':
        return 'Please enter your city.';
      case 'state':
        return 'Please select a state.';
      case 'zipcode':
        return 'Please enter your zipcode.';
      case 'password':
        return (
          'Password must be 10-128 characters,' +
          ' contain 1 uppercase letter,' +
          ' 1 lowercase letter, a number,' +
          ' and a character from !@#$%^&*-_=+,.?'
        );
      case 'confirmPassword':
        return 'Password entries must match.';
      default:
        return 'This field is required.';
    }
  }

  onCloseAlert() {
    this.errorMsg = undefined;
  }
}

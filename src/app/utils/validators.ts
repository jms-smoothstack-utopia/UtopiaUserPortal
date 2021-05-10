import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { card, cvc } from 'creditcards';

export function trimStringLength(
  minLength: number,
  maxLength?: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!!control.value) {
      const toCheck = control.value.trim();

      if (toCheck.length < minLength) {
        return { stringUnderMin: true };
      }
      if (!!maxLength && toCheck.length > maxLength) {
        return { stringOverMax: true };
      }
    }
    return null;
  };
}

const phoneUtil = PhoneNumberUtil.getInstance();

export function USPhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!!control.value) {
      if (
        !phoneUtil.isValidNumberForRegion(
          phoneUtil.parse(control.value, 'US'),
          'US'
        )
      ) {
        return { invalidPhoneNumber: true };
      }
    }
    return null;
  };
}

export function cardNumberValidator(control: AbstractControl) {
  return validateCard(control);
}

export function cvcValidator(control: AbstractControl) {
  return validateCvc(control);
}

export const expirationValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const expMonth = control.get('expMonth');
  const expYear = control.get('expYear');
  const now = new Date(Date.now());
  const currentYear = now.getFullYear();
  if (expYear && expYear.value as number === currentYear) {
    const currentMonth = now.getMonth();
    if (expMonth && expMonth.value as number <= currentMonth) {
      return { invalidExpiration: true };
    }
  }
  return null;
};

function validateCard(control: AbstractControl): {[key: string]: any} | null {
  if (!control.value) {
    return null;
  }
  let parsed = card.parse(control.value);
  let valid = card.isValid(parsed);
  if (!valid) {
    return { invalidCard: true };
  } else {  //good card
    return null;
  }
}

function validateCvc(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  if (!cvc.isValid(control.value)) {
    return { invalidCvc: true };
  }
  return null;
}

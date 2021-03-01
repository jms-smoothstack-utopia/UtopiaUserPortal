import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

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

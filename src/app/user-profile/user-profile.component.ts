import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { User } from '../user';
import { UserService } from "../services/user.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { trimStringLength, USPhoneNumberValidator } from '../utils/validators';
import US_STATE_LIST from '../services/us-state/us-states';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() user: User | undefined;
  @Input() error: HttpErrorResponse | undefined;

  states = US_STATE_LIST.map((s) => s.abbr);

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  userProfileForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, trimStringLength(1)]),
    lastName: new FormControl('', [Validators.required, trimStringLength(1)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    addrLine1: new FormControl('', [Validators.required, trimStringLength(1)]),
    addrLine2: new FormControl('', [trimStringLength(1)]), //NOT required
    city: new FormControl('', [Validators.required, trimStringLength(1)]),
    state: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/)]),
    //slightly different regex for phoneNumber (vs. account creation) to match how it comes in from the backend
    phoneNumber: new FormControl('', [Validators.required, USPhoneNumberValidator, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]),  
    loyaltyPoints: new FormControl({ disabled: true }),
    ticketEmails: new FormControl(''),
    flightEmails: new FormControl('')
  });

  //should we show an error for the specified field?
  showErrorForField(field: string) {
    const control = this.userProfileForm.get(field);  //get the specified form field, such as firstNameControl
    //yes, if the specified field exists, has been used by the user, and isn't valid
    return control && control.touched && control.invalid;
  }

  getUser(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    //have to do this check since the application is in strict mode
    if (rawId === null) {
      //TODO: do some kind of error thing
    } else {
      const id = rawId;
      this.userService.getUser(id).subscribe(myUser => this.setUser(myUser));
    }
  }

  setUser(response: User | HttpErrorResponse): void {
    if (this.checkIsValidUser(response)) {
      this.user = response;
      this.fillThisUserAddr();
      //must set values after fillThisUserAddr, when address is flattened onto the user
      this.userProfileForm.patchValue(this.user);
    } else if (this.checkIsError(response)) {
      this.error = response;
    }
  }

  updateUser(): void {
    if (this.checkIsValidUser(this.user)) {
      this.userService.updateUser(this.user)
        .subscribe(updatedUser => this.setUser(updatedUser));
    }
  }

  checkIsValidUser(returnedValue: User | HttpErrorResponse | undefined): returnedValue is User {
    //try to cast it to a User and check its firstName to see if it's actually a user
    return (returnedValue as User).firstName !== undefined;
  }

  checkIsError(returnedValue: any): returnedValue is HttpErrorResponse {
    return (returnedValue as HttpErrorResponse).status !== undefined;
  }

  /*
  necessary because the customer microservice expects address info to be
  on the user directly, when updating the user
  */
  
  fillThisUserAddr(): void {
    if (this.checkIsValidUser(this.user)) {
      this.user.addrLine1 = this.user.addresses[0].line1;
      this.user.addrLine2 = this.user.addresses[0].line2;
      this.user.city = this.user.addresses[0].city;
      this.user.state = this.user.addresses[0].state;
      this.user.zipcode = this.user.addresses[0].zipcode;
    }
  }

  ngOnInit(): void {
    this.getUser();
  }

}

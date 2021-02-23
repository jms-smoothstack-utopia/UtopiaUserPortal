import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { User } from '../user';
import { Address } from '../address';
import { UserService } from "../user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() user: User | undefined;
  @Input() error: HttpErrorResponse | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  getUser(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    //have to do this check since the application is in strict mode
    if (rawId === null) {
      //TODO: do some kind of error thing
    } else {
      const id = +rawId;  //cast rawId as a number
      this.userService.getUser(id).subscribe(myUser => this.setUser(myUser));
    }
  }

  checkIsValidUser(returnedValue: User | HttpErrorResponse): returnedValue is User {
    console.log('checkIsValidUser got this:');
    console.log(returnedValue);
    //try to cast it to a User and check its firstName to see if it's actually a user
    return (returnedValue as User).firstName !== undefined;
  }

  checkIsError(returnedValue: any): returnedValue is HttpErrorResponse {
    return (returnedValue as HttpErrorResponse).status !== undefined;
  }

  setUser(response: User | HttpErrorResponse): void {
    if (this.checkIsValidUser(response)) {
      this.user = response;
    } else if (this.checkIsError(response)) {
      this.error = response;
    }
  }

  ngOnInit(): void {
    this.getUser();
  }

}

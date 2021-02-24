import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import PathConstants from '../../../environments/paths';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  accountForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    addrLine1: new FormControl('', Validators.required),
    addrLine2: new FormControl(''),
    phoneNumber: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private log: NGXLogger
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.log.debug('Already logged in.');
      this.router.navigate([PathConstants.USER_PROFILE]);
    }
  }

  onSubmit() {}
}

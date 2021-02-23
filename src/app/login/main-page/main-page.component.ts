import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

import PathConstants from '../../../environments/paths';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  errorMsg?: string = undefined;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private log: NGXLogger
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([PathConstants.USER_PROFILE]);
    }
  }

  onSubmitLogin(authForm: NgForm) {
    if (!authForm.valid) {
      this.log.debug('Invalid form');
      this.errorMsg = 'Please enter a valid email.';
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    this.isLoading = true;

    this.authService.login(email, password).subscribe(
      () => {
        this.handleLoginSuccess().then(() => authForm.reset());
      },
      (err: HttpErrorResponse) => {
        this.handleLoginFailure(err).then(() => authForm.reset());
      }
    );
  }

  async handleLoginSuccess() {
    this.errorMsg = undefined;
    this.isLoading = false;
    await this.router.navigate([PathConstants.USER_PROFILE]);
  }

  async handleLoginFailure(err: HttpErrorResponse) {
    this.log.debug('Failure', err);
    this.isLoading = false;
    if (err.status == 403) {
      this.errorMsg = 'Invalid email or password';
    } else {
      this.errorMsg = 'An error occurred while logging in. Please try again.';
    }
  }

  goToForgetPasswordPage() {
    this.router.navigateByUrl('/login/forgotpassword');
  }

  makeAnAccount() {
    this.router.navigateByUrl('/login/accountmaker');
  }

  onCloseAlert() {
    this.errorMsg = undefined;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

import PathConstants from '../../../environments/paths';

@Component({
  selector: 'app-main-page',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  errorMsg?: string = undefined;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private log: NGXLogger
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      //todo Navigate back to previous location if present
      this.router.navigate(['/']);
    }
  }

  //TODO:
  // Disable button if no entry
  // Display feedback if no entry
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
    await this.router.navigate(['/']);
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
    this.router.navigate([PathConstants.CREATE_ACCOUNT]);
  }

  onCloseAlert() {
    this.errorMsg = undefined;
  }
}

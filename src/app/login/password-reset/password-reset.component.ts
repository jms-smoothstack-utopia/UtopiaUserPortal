import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../shared/methods/http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {
  errorMsg?: string = undefined;
  moreInfoMsg?: string = undefined;
  isLoading = false;

  constructor(
    private log: NGXLogger,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmitPasswordReset(passwordResetForm: NgForm) {
    if (!passwordResetForm.valid) {
      this.log.debug('Invalid form');
      this.errorMsg = 'Please enter a valid email to reset your password';
      return;
    }

    const email = passwordResetForm.value.email;

    this.isLoading = true;

    let url = environment.accountsEndpoint + '/password-reset';

    this.httpService.post(url, email).subscribe(
      () => {
        this.successPasswordReset();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.errorPasswordReset(err);
      }
    );
  }

  async successPasswordReset() {
    this.errorMsg = undefined;
    this.isLoading = false;
    await this.router.navigateByUrl('login/forgotpassword/checkemail');
  }

  errorPasswordReset(err: HttpErrorResponse) {
    this.log.debug('Failure', err);
    this.isLoading = false;
    if (err.status == 404) {
      this.errorMsg = 'The email was not found. Please confirm your email!';
      this.moreInfoMsg =
        "<a href='login/accountmaker'>Click here to sign up!</a><hr><a href='login'>Click here to login!</a>";
    } else {
      this.errorMsg =
        'An error occurred while processing your request. Please try again.';
    }
  }

  onCloseAlert() {
    this.errorMsg = undefined;
    this.moreInfoMsg = undefined;
  }
}

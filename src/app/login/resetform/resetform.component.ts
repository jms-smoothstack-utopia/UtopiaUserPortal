import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { HttpService } from 'src/app/shared/methods/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resetform',
  templateUrl: './resetform.component.html',
  styleUrls: ['./resetform.component.css'],
})
export class ResetformComponent implements OnInit {
  errorMsg?: string = undefined;
  passwordRegex: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*-_=+,.?])[A-Za-z\\d!@#$%^&*-_=+,.?]{10,128}$';
  isLoading = false;
  userToken: any;
  form: NgForm | undefined;

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private log: NGXLogger,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.userToken = params['token'];
    });

    //We need to verify the token. If it is a valid token, then let user see page.
    //Otherwise, send to 404 page

    let url = environment.accountsEndpoint + '/new-password/' + this.userToken;

    this.httpService.get(url).subscribe(
      () => {},
      (err: HttpErrorResponse) => {
        console.log(err);
        this.router.navigate(['404/notfound'], { replaceUrl: true });
      }
    );
  }

  ngOnInit(): void {}

  onCloseAlert() {
    this.errorMsg = undefined;
  }

  onSubmitPasswordResetWithToken(onSubmitPasswordResetWithToken: NgForm) {
    this.form = onSubmitPasswordResetWithToken;

    if (!onSubmitPasswordResetWithToken.valid) {
      this.log.debug('Invalid form');
      this.errorMsg = 'Please enter your new password.';
      return;
    }

    const newPassword = onSubmitPasswordResetWithToken.value.password;
    const newPasswordValidation =
      onSubmitPasswordResetWithToken.value.passwordvalidation;

    var res = newPassword.match(this.passwordRegex);

    if (newPassword != newPasswordValidation) {
      this.log.debug('Invalid form');
      this.errorMsg = 'Please enter the same password in both input boxes';
      return;
    }

    if (res == null) {
      this.log.debug('Invalid form');
      this.errorMsg =
        'Password must be between 10 and 128 characters,' +
        ' contain at least one lowercase letter,' +
        ' at least one uppercase letter,' +
        ' at least one number,' +
        ' and at least one special character from the following: !@#$%^&*-_=+,.?';
      return;
    }

    let JSONObject = {
      password: newPassword,
      token: this.userToken,
    };

    let url = environment.accountsEndpoint + '/new-password';

    this.httpService.post(url, JSONObject).subscribe(
      () => {
        this.passwordIsReset();
      },
      (err: HttpErrorResponse) => {
        this.passwordIsNotReset(err);
      }
    );
  }

  resetPageForm() {
    if (this.form != undefined) {
      this.form.reset();
    }
  }

  async passwordIsReset() {
    this.errorMsg = undefined;
    this.isLoading = false;
    this.router.navigateByUrl('login/password/confirmationchange');
  }

  async passwordIsNotReset(err: HttpErrorResponse) {
    this.log.debug('Failure', err);
    this.isLoading = false;
    if (err.status == 404) {
      this.errorMsg =
        'The token you provided is expired or invalid. Please resetting your password again.';
      this.router.navigateByUrl('login');
    } else if (err.status == 400) {
      this.errorMsg =
        'Password must be between 10 and 128 characters,' +
        ' contain at least one lowercase letter,' +
        ' at least one uppercase letter,' +
        ' at least one number,' +
        ' and at least one special character from the following: !@#$%^&*-_=+,.?';
    } else {
      this.errorMsg =
        'An error occurred while trying to process your request. Please try again.';
    }
  }
}

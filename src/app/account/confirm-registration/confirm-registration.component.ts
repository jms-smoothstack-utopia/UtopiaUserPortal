import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.css'],
})
export class ConfirmRegistrationComponent implements OnInit {
  isLoading = false;
  alertMsg?: string = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private log: NGXLogger
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const confirmationTokenId = this.activatedRoute.snapshot.paramMap.get(
      'confirmationTokenId'
    );

    if (confirmationTokenId) {
      this.authService.confirmRegistration(confirmationTokenId).subscribe(
        (res) => {
          this.isLoading = false;
          this.log.debug(res);
          this.alertMsg = 'Thank you for confirming your account!';
        },
        (err) => {
          this.isLoading = false;
          this.log.error(err);
          this.alertMsg =
            'There was a problem processing your request. The code monkeys have been notified!';
        }
      );
    } else {
      this.alertMsg =
        'Please follow the link provided in your email to confirm your account.';
    }
  }

  onCloseAlert() {
    this.alertMsg = undefined;
    this.router.navigate(['/']);
  }
}

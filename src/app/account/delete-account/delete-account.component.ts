import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: [
    '../../shared/alert/alert.component.css',
    './delete-account.component.css',
  ],
})
export class DeleteAccountComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<void>();
  isLoading = false;
  emailSent = false;
  errorMessage?: string;

  constructor(private authService: AuthService, private log: NGXLogger) {}

  ngOnInit(): void {}

  onSubmitConfirmation(confirmForm: NgForm) {
    this.isLoading = true;

    const email = confirmForm.value.email;
    const password = confirmForm.value.password;
    confirmForm.resetForm();

    this.authService.deleteAccount(email, password).subscribe(
      (res) => {
        this.log.info(res);
        this.isLoading = false;
        this.emailSent = true;
      },
      (err) => {
        this.log.error(err);
        this.isLoading = false;
        this.errorMessage =
          'Your request could not be processed. Please verify you entered the correct credentials.';
      }
    );
  }

  onClose() {
    this.isLoading = false;
    this.emailSent = false;
    this.errorMessage = undefined;
    this.closeEvent.emit();
  }

  onRetryFromError() {
    this.errorMessage = undefined;
  }
}

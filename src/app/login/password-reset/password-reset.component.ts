import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  errorMsg?: string = undefined;
  isLoading = false;
  constructor(
    private log:NGXLogger
  ) { }

  ngOnInit(): void {
  }

  onSubmitPasswordReset(passwordResetForm: NgForm){
    return;
  }

}

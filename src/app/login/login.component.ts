import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onSubmit(authForm: NgForm) {

    // const email = authForm.value.email;
    // const password = authForm.value.password;
    const email = "test@test.com";
    const password = "abCD1234!@";

    this.authService.authenticate(email, password)
    .subscribe(res => {
      console.log("ON SUBMIT")
      console.log(res);
    })
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-mainheader',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() hideSignInButton = false;

  buttonMsg = 'Sign in';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.setButtonMsg();
  }

  private setButtonMsg() {
    if (this.authService.isLoggedIn()) {
      this.buttonMsg = 'Sign out';
    } else {
      this.buttonMsg = 'Sign in';
    }
  }

  async onClickButton() {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }
    await this.router.navigateByUrl('/login');

    this.setButtonMsg();
  }
}

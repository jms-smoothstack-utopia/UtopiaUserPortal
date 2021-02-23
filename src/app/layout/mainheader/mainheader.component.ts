import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-mainheader',
  templateUrl: './mainheader.component.html',
  styleUrls: ['./mainheader.component.css'],
})
export class MainheaderComponent implements OnInit {
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

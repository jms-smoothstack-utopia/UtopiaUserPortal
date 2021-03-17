import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import PathConstants from 'src/environments/paths';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css'],
})
export class UserNavbarComponent implements OnInit {
  private customerId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  goToProfile(): void {
    this.router.navigate([PathConstants.USER_PROFILE]);
  }

  goToHistory(): void {
    this.router.navigateByUrl(`/flights/history/${this.customerId}`);
  }

  goToUpcoming(): void {
    this.router.navigateByUrl(`/flights/upcoming/${this.customerId}`);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([PathConstants.LOGIN]);
    }
    this.customerId = this.authService.userId;
  }
}

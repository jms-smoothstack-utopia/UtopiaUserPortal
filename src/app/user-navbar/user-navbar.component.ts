import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import PathConstants from 'src/environments/paths';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css'],
})
export class UserNavbarComponent implements OnInit {
  @Input() parentComponent: string | undefined;
  profileActive: boolean = false;
  historyActive: boolean = false;
  upcomingActive: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  goToProfile(): void {
    this.router.navigate([PathConstants.USER_PROFILE]);
  }

  goToHistory(): void {
    this.router.navigate([PathConstants.FLIGHT_HISTORY]);
  }

  goToUpcoming(): void {
    this.router.navigate([PathConstants.FLIGHT_UPCOMING]);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([PathConstants.LOGIN]);
    }
    this.determineActive();
  }

  determineActive(): void {
    switch(this.parentComponent) {
      case 'profile':
        this.profileActive = true;
        break;
      case 'history':
        this.historyActive = true;
        break;
      case 'upcoming':
        this.upcomingActive = true;
        break;
      default:
        //do nothing
        //conveniently, nothing in the navbar will be styled as active, in this case
    }
  }
}

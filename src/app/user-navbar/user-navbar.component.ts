import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import PathConstants from 'src/environments/paths';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css'],
})
export class UserNavbarComponent implements OnInit {
  @Input() parentComponent: string | undefined;
  private customerId: string | undefined;
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
    this.determineActive();
  }

  determineActive(): void {
    console.log('PARENTCOMPONENT:')
    console.log(this.parentComponent);
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

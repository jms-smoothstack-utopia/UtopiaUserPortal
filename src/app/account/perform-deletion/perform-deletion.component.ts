import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perform-deletion',
  templateUrl: './perform-deletion.component.html',
  styleUrls: ['./perform-deletion.component.css'],
})
export class PerformDeletionComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private log: NGXLogger
  ) {}

  ngOnInit(): void {
    const confirmationToken = this.activatedRoute.snapshot.paramMap.get(
      'confirmationToken'
    );
    if (confirmationToken) {
      this.authService.confirmDeletion(confirmationToken).subscribe(
        (res) => {
          this.log.info(res);
        },
        (err) => {
          this.log.error(err);
        }
      );
    } else {
      this.log.error('No confirmation token received.');
      this.router.navigate(['404']);
    }
  }
}

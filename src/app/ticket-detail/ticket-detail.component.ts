import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import PathConstants from 'src/environments/paths';
import { AuthService } from '../services/auth/auth.service';
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { Ticket } from '../ticket';
import { Flight } from '../flight';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | undefined;
  flight: Flight | undefined;
  error: HttpErrorResponse | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private flightRecordsService: FlightRecordsService,
    private router: Router,
    private log: NGXLogger
    ) { }

  ngOnInit(): void {
      //if not logged in
      if (!this.authService.isLoggedIn()) {
        this.log.debug('Not logged in, redirecting to login screen.');
        this.router.navigate([PathConstants.LOGIN]);
      } else {
        //this.getTicket();
        //this.getFlight();
      }
    }

}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import PathConstants from 'src/environments/paths';
import { AuthService } from '../services/auth/auth.service';
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { Ticket } from '../ticket';

@Component({
  selector: 'app-user-flight-upcoming',
  templateUrl: './user-flight-upcoming.component.html',
  styleUrls: ['./user-flight-upcoming.component.css'],
})
export class UserFlightUpcomingComponent implements OnInit {
  @Input() tickets: Ticket[] | undefined;
  @Input() error: HttpErrorResponse | undefined;
  activeForNav: string = 'upcoming';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private flightRecordsService: FlightRecordsService,
    private router: Router,
    private log: NGXLogger
  ) {}

  getUpcoming(): void {
    const customerId = this.authService.userId;
    if (customerId !== null && customerId !== undefined) {
      this.flightRecordsService
        .getTicketsUpcoming(customerId)
        .subscribe((tickets) => this.setUpcoming(tickets));
    }
  }
  setUpcoming(value: Ticket[]): void {
    if (value === null) {
      //if there are no returned tickets
      this.tickets = [];
    } else if (this.checkIsValidTickets(value)) {
      this.tickets = value;
      this.tickets.forEach((ticket) => {
        var rawDate: Date = new Date(ticket.flightTime);
        ticket.timePrettyPrint = rawDate.toString();
        ticket.statusPrettyPrint = ticket.status
          .replace('_', ' ')
          .toLowerCase();
      });
    } else if (this.checkIsError(value)) {
      this.error = value;
    }
  }

  checkIsValidTickets(
    returnedValue: Ticket[] | HttpErrorResponse | undefined
  ): returnedValue is Ticket[] {
    if ((returnedValue as HttpErrorResponse).status !== undefined) {
      //if it's an error
      return false;
    } else if ((returnedValue as Ticket[]).length == 0) {
      //if empty array, true
      return true;
    }
    //assumes there are tickets
    return (returnedValue as Ticket[])[0].flightId !== undefined;
  }

  checkIsError(returnedValue: any): returnedValue is HttpErrorResponse {
    return (returnedValue as HttpErrorResponse).status !== undefined;
  }

  ngOnInit(): void {
    //if not logged in
    if (!this.authService.isLoggedIn()) {
      this.log.debug('Not logged in, redirecting to login screen.');
      this.router.navigate([PathConstants.LOGIN]);
    } else {
      this.getUpcoming();
    }
  }
}

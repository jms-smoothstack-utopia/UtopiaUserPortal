import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import PathConstants from 'src/environments/paths';
import { AuthService } from '../services/auth/auth.service';
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { Ticket, TicketsList } from '../ticket';

@Component({
  selector: 'app-user-flight-list',
  templateUrl: './user-flight-list.component.html',
  styleUrls: ['./user-flight-list.component.css']
})
export class UserFlightListComponent implements OnInit {
  @Input() listType: TicketsList | undefined;
  tickets: Ticket[] | undefined;
  error: HttpErrorResponse | undefined;

  constructor(
    private authService: AuthService,
    private flightRecordsService: FlightRecordsService,
    private log: NGXLogger,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.log.debug('Not logged in, redirecting to login screen.');
      this.router.navigate([PathConstants.LOGIN]);
    } else {
      this.getTickets();
    }
  }

  getTickets(): void {
    const customerId = this.authService.userId;
    if (this.checkIsValidCustomerId(customerId) && this.checkIsValidListType(this.listType)) {
      this.flightRecordsService
        .getTicketsByType(customerId, this.listType)
        .subscribe((tickets) => this.setTickets(tickets));
    }
  }

  setTickets(value: Ticket[]): void {
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

  checkIsValidCustomerId(customerId: string | undefined): customerId is string {
    return (customerId !== null && customerId !== undefined);
  }

  checkIsValidListType(listType: TicketsList | undefined): listType is TicketsList {
    if ((listType as TicketsList) !== undefined) {
      return true;
    }
    else {
      this.log.error(`Bad ticket list type? ${listType}`);
      return false;
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

}

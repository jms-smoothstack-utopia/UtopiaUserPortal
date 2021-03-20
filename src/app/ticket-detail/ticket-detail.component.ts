import { Location } from '@angular/common'
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
    private location: Location,
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
        this.getTicket();
        //getFlight called inside setTicket
      }
    }

  getTicket(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId !== null) {
      this.flightRecordsService.getTicketById(ticketId).subscribe(
            (myTicket) => this.setTicket(myTicket)
      );
    }
  }

  setTicket(response: Ticket | HttpErrorResponse): void {
    if (this.checkIsValidTicket(response)) {
      this.ticket = response;
      this.log.debug(`got ticket ${response.id}`);
      //retrieving flight info here, once we're sure we have a ticket
      this.getFlight();
    } else if (this.checkIsError(response)) {
      this.error = response;
    }
  }

  getFlight(): void {
    if (this.error && (this.error !== undefined)) {
      //shouldn't get here due to where getFlight is called
      //but checking for an error just in case
      return;
    }
    const flightId = (this.ticket as Ticket).flightId;
    this.flightRecordsService.getFlightById(flightId).subscribe(
      (myFlight) => this.setFlight(myFlight)
    );
  }

  setFlight(response: Flight | HttpErrorResponse): void {
    if (this.checkIsValidFlight(response)) {
      this.log.debug(`got flight ${response.id}`);
      this.flight = response;
      this.doPrettyPrinting();
    } else if (this.checkIsError(response)) {
      //consider removing display of the ticket we retrieved if that worked
      //but flight info failed?
      this.error = response;
    }
  }

  doPrettyPrinting(): void {
    //in this context, the ticket's date string only needs to be the date, not also time
    (this.ticket as Ticket).timePrettyPrint = 
      new Date((this.ticket as Ticket).flightTime).toDateString();
    (this.ticket as Ticket).statusPrettyPrint = 
      (this.ticket as Ticket).status.replace('_', ' ').toLowerCase();
    //time zones displayed are just as they get passed from the backend
    (this.flight as Flight).departurePrettyPrint = 
      new Date((this.flight as Flight).approximateDateTimeStart).toTimeString();
    (this.flight as Flight).arrivalPrettyPrint = 
      new Date((this.flight as Flight).approximateDateTimeEnd).toTimeString();
  }

  checkIsValidTicket(returnedValue: Ticket | HttpErrorResponse | undefined): 
      returnedValue is Ticket {
    return (returnedValue as Ticket).status !== undefined;
  }

  checkIsValidFlight(returnedValue: Flight | HttpErrorResponse | undefined): 
      returnedValue is Flight {
    return (returnedValue as Flight).possibleLoyaltyPoints !== undefined;
  }

  checkIsError(returnedValue: any): returnedValue is HttpErrorResponse {
      return (returnedValue as HttpErrorResponse).status !== undefined;
  }

  back(): void {
    this.location.back();
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { Ticket } from 'src/app/ticket';
import { Flight } from 'src/app/flight'
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class FlightRecordsService {
  private ticketHistoryUrl = environment.hostUrl + '/tickets/history';
  private ticketUpcomingUrl = environment.hostUrl + '/tickets/upcoming';
  private ticketDetailUrl = environment.hostUrl + '/tickets';
  private ticketCancelUrl = environment.hostUrl + '/tickets/cancel';
  private flightUrl = environment.hostUrl + '/flights';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(private http: HttpClient, private log: NGXLogger) { }

  getTicketsHistory(customerId: string): Observable<Ticket[]> {
    const url = `${this.ticketHistoryUrl}/${customerId}`;
    return this.http.get<Ticket[]>(url);
  }

  getTicketsUpcoming(customerId: string): Observable<Ticket[]> {
    const url = `${this.ticketUpcomingUrl}/${customerId}`;
    return this.http.get<Ticket[]>(url);
  }

  getTicketById(ticketId: string): Observable<Ticket> {
    const url = `${this.ticketDetailUrl}/${ticketId}`;
    return this.http.get<Ticket>(url);
  }

  cancelTicketById(ticketId: number) {
    const url = `${this.ticketCancelUrl}/${ticketId}`;
    return this.http.put(url, this.httpOptions);
    //no content, just the put request and ID in the URL
  }

  getFlightById(flightId: number): Observable<Flight> {
    const url = `${this.flightUrl}/${flightId}`;
    return this.http.get<Flight>(url);
  }
}

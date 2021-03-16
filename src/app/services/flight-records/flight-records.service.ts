import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { Ticket } from 'src/app/ticket';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class FlightRecordsService {
  private ticketHistoryUrl = environment.hostUrl + '/tickets/history';
  private ticketUpcomingUrl = environment.hostUrl + '/tickets/upcoming';
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
}
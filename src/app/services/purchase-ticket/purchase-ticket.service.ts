import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { User } from '../../user';
import { purchaseTicketDto, TicketItem } from '../../purchaseTicketDto';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user.service';
import { FlightRecordsService } from '../flight-records/flight-records.service';
import { Flight } from '../../flight';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseTicketService {
  private ticketPurchaseUrl = environment.hostUrl + '/tickets';

  constructor(
    private http: HttpClient,
    private log: NGXLogger,
    private authService: AuthService,
    private userService: UserService,
    private flightRecordsService: FlightRecordsService,
  ) { }

  purchaseTickets(viewList: any, userName: string) {
    let ticketsToPurchase: purchaseTicketDto = {
      purchaserId: (this.authService.userId as string),
      flightId: viewList[0].flight.id,
      tickets: []
    };
    let retrievedTime: Date = viewList[0].flight.approximateDateTimeStart;
    viewList.forEach((cartObject: any) => {
      let newTicket: TicketItem = {
        seatClass: (cartObject.seatClass as string).toUpperCase(),
        seatNumber: this.getFirstAvailableSeat(cartObject),
        passengerName: userName,
        flightTime: retrievedTime
      };
      ticketsToPurchase.tickets.push(newTicket);
    });
    this.log.debug('TICKETS TO PURCHASE:');
    this.log.debug(ticketsToPurchase);
    //now that we've assembled the tickets, send them off
    //server sends back 204 on success, so no expected return type
    return this.http.post(this.ticketPurchaseUrl, ticketsToPurchase);
  }

  //temporary method to pick a seat until seat choosing is implemented
  //iterating through an array while we're already iterating through an array
  //is awful for performance, so don't keep this around longer than necessary
  getFirstAvailableSeat(cartObject: any): string {
    let seatClass: string = cartObject.seatClass.toUpperCase();
    let seatNumber: string = '';
    let i = 0;
    do {  
        //on each iteration: check the seat itself
        let seat = cartObject.flight.seats[i];
        if ((seat.seatClass === seatClass)
              && (seat.seatStatus === 'AVAILABLE')) {
          seatNumber = seat.seatRow + seat.seatColumn;
          //there's some weird stuff with how TypeScript handles scope that I
          //need to figure out, but for the sake of making it work, returning
          //seatNumber here works
          //TODO: fix this at some point
          return seatNumber;
        }
        i++;
    } while (seatNumber === '') //then check to see if we found a valid seat

    //TODO: fail somehow if we get through all seats and none available
    //currently assuming that a flight with no seats can't be put in the cart
    return seatNumber;
  }
}

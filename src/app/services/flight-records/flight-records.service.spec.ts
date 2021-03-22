import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  LoggerConfig,
  NGXLogger,
  NGXLoggerHttpService,
  NgxLoggerLevel,
  NGXMapperService,
} from 'ngx-logger';
import {
  NGXLoggerHttpServiceMock,
  NGXMapperServiceMock,
} from 'ngx-logger/testing';
import { DatePipe } from '@angular/common';
import { FlightRecordsService } from './flight-records.service';
import { Ticket } from '../../ticket';
import { Flight } from '../../flight'

describe('FlightRecordsService', () => {
  let service: FlightRecordsService;
  let httpTestingController: HttpTestingController;
  let mockId = '00000000-0000-0000-0000-000000000000';

  let mockTime = new Date(Date.now());
  let mockTicket1: Ticket = {
    id: 1,
    flightId: 1,
    flightTime: mockTime,
    purchaserId: '00000000-0000-0000-0000-000000000000',
    passengerName: 'Foo',
    seatClass: 'First',
    seatNumber: '1B',
    status: 'CHECKED_IN',
    statusPrettyPrint: '', //these are filled in by components that use the service
    timePrettyPrint: '', 
  };

  let mockTicket2: Ticket = {
    id: 2,
    flightId: 1,
    flightTime: mockTime,
    purchaserId: '00000000-0000-0000-0000-000000000001',
    passengerName: 'Bar',
    seatClass: 'Business',
    seatNumber: '13B',
    status: 'CHECKED_IN',
    statusPrettyPrint: '',
    timePrettyPrint: '',
  };
  let mockTickets: Ticket[] = [mockTicket1, mockTicket2];

  let mockFlight: Flight = {
    id: 1,
    possibleLoyaltyPoints: 50,
    origin: { 
              iataId: 'ABC', 
              name: 'Abc Airport',
              streetAddress: '123 Fake St',
              city: 'Anywhere',
              state: 'TN',
              zipcode: '12345',
              servicingArea: { id: 1, areaName: 'Somewhere'}
            },
    destination:  { 
                    iataId: 'XYZ', 
                    name: 'Xyz Airport',
                    streetAddress: '789 Fake St',
                    city: 'Anywhere',
                    state: 'TN',
                    zipcode: '12345',
                    servicingArea: { id: 1, areaName: 'Somewhere'}
                  },
    airplane: {
                id: 1,
                name: 'Planey McPlaneface',
                seatConfigurations: [{
                                      id: 1,
                                      seatClass: 'First',
                                      numRows: 1,
                                      numSeatsPerRow: 2
                                    }]
              },
    seats:  [{
              id: '1-1A',
              seatRow: 1,
              seatColumn: 'A',
              seatClass: 'First',
              seatStatus: 'SOLD',
              price: 1
            }],
    creationDateTime: new Date(Date.now()),
    approximateDateTimeStart: new Date(Date.now() + 1),
    approximateDateTimeEnd: new Date(Date.now() + 2),
    flightActive: true,
    departurePrettyPrint: '', //expect these to be filled in
    arrivalPrettyPrint: ''
  }

  //test whether it sends requests

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
    });

    service = TestBed.inject(FlightRecordsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('history mock customer ID should return tickets', () => {
    service.getTicketsHistory(mockId).subscribe((res) => {
      expect(res.length).toEqual(2);
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/tickets/history/' + mockId
    );
    req.flush(mockTickets);
  });

  it('upcoming mock customer ID should return tickets', () => {
    service.getTicketsUpcoming(mockId).subscribe((res) => {
      expect(res.length).toEqual(2);
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/tickets/upcoming/' + mockId
    );
    req.flush(mockTickets);
  });

  it('getTicketById should return ticket', () => {
    service.getTicketById(1).subscribe((res) => {
      expect(res.passengerName).toEqual('Foo');
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/tickets/' + '1'
    );
    req.flush(mockTicket1);
  });

  it('cancelTicketById should return no content', () => {
    service.cancelTicketById(1).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/tickets/cancel/' + '1'
    );
    req.flush(true, { status: 204, statusText: 'No Content' });
  });

  it('getFlightById should return flight', () => {
    service.getFlightById(1).subscribe((res) => {
      expect(res.airplane.name).toEqual('Planey McPlaneface');
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/flights/' + '1'
    );
    req.flush(mockFlight);
  });
});

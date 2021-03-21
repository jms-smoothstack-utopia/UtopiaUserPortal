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
});

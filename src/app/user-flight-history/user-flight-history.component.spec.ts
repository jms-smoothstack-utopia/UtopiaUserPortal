import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightHistoryComponent } from './user-flight-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
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
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { Ticket } from '../ticket';

describe('UserFlightHistoryComponent', () => {
  let component: UserFlightHistoryComponent;
  let fixture: ComponentFixture<UserFlightHistoryComponent>;
  let flightRecordsServiceSpy: FlightRecordsService;

  const mockTime = new Date(Date.now() - 1000); //past tickets
  const mockTimeStr = mockTime.toString();

  var mockTicket1: Ticket = {
    id: 1,
    flightId: 1,
    flightTime: mockTime,
    purchaserId: '00000000-0000-0000-0000-000000000000',
    passengerName: 'Foo',
    seatClass: 'First',
    seatNumber: '1B',
    status: 'CHECKED_IN',
    timePrettyPrint: '',    //expect to be filled in
  }

  var mockTicket2: Ticket = {
    id: 2,
    flightId: 1,
    flightTime: mockTime,
    purchaserId: '00000000-0000-0000-0000-000000000001',
    passengerName: 'Bar',
    seatClass: 'Business',
    seatNumber: '13B',
    status: 'CHECKED_IN',
    timePrettyPrint: '', 
  }

  var mockTicket3: Ticket = {
    id: 3,
    flightId: 1,
    flightTime: mockTime,
    purchaserId: '00000000-0000-0000-0000-000000000002',
    passengerName: 'Baz',
    seatClass: 'Coach',
    seatNumber: '30B',
    status: 'CHECKED_IN',
    timePrettyPrint: '',
  }

  var mockTicketArr = [mockTicket1, mockTicket2, mockTicket3];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFlightHistoryComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    flightRecordsServiceSpy = fixture.debugElement.injector.get(FlightRecordsService);
  });

  afterEach(() => {
    mockTicketArr.forEach(ticket => {
      ticket.timePrettyPrint = '';
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkIsValidTickets returns true with ticket array', () => {
    expect(component.checkIsValidTickets(mockTicketArr)).toBeTrue();
  });

  it('checkIsValidTickets returns true with empty array', () => {
    expect(component.checkIsValidTickets([])).toBeTrue();
  });

  it('setHistory should set tickets, fill in their date/time strings', () => {
    component.setHistory(mockTicketArr);

    (component.tickets as Ticket[]).forEach(ticket => {
      expect(ticket.timePrettyPrint == mockTimeStr);
    });
  });

});

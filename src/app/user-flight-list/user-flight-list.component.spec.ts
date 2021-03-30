import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightListComponent } from './user-flight-list.component';
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
import { Ticket, TicketsList } from '../ticket';
import { AuthService } from '../services/auth/auth.service';
import { AppRoutingModule } from '../app-routing.module';


describe('UserFlightListComponent', () => {
  let component: UserFlightListComponent;
  let fixture: ComponentFixture<UserFlightListComponent>;
  let flightRecordsServiceSpy: FlightRecordsService;
  let authService: AuthService;

  const mockTime = new Date(Date.now() - 1000); //past tickets
  const mockTimeStr = mockTime.toString();
  const mockPrettyStatusStr = 'checked in';

  let mockTicket1: Ticket = {
    id: 1,
    flightId: 1,
    flightTime: mockTime,
    purchaserId: '00000000-0000-0000-0000-000000000000',
    passengerName: 'Foo',
    seatClass: 'First',
    seatNumber: '1B',
    status: 'CHECKED_IN',
    statusPrettyPrint: '',
    timePrettyPrint: '', //expect these to be filled in
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

  let mockTicket3: Ticket = {
    id: 3,
    flightId: 1,
    flightTime: mockTime,
    purchaserId: '00000000-0000-0000-0000-000000000002',
    passengerName: 'Baz',
    seatClass: 'Coach',
    seatNumber: '30B',
    status: 'CHECKED_IN',
    statusPrettyPrint: '',
    timePrettyPrint: '',
  };

  let mockTicketArr = [mockTicket1, mockTicket2, mockTicket3];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFlightListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppRoutingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    flightRecordsServiceSpy = fixture.debugElement.injector.get(
      FlightRecordsService
    );
    authService = fixture.debugElement.injector.get(AuthService);

    spyOn(authService, 'isLoggedIn').and.returnValue(true);
  });

  afterEach(() => {
    mockTicketArr.forEach((ticket) => {
      ticket.timePrettyPrint = '';
      ticket.statusPrettyPrint = '';
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

  it('setTickets should set tickets, fill in their date/time and pretty status strings', () => {
    component.setTickets(mockTicketArr);

    const tickets = component.tickets;

    expect(tickets).toBeTruthy();
    expect(tickets?.length).toBeGreaterThan(0);

    tickets!.forEach((ticket) => {
      expect(ticket.timePrettyPrint == mockTimeStr);
      expect(ticket.statusPrettyPrint == mockPrettyStatusStr);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailComponent } from './ticket-detail.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
import { AppRoutingModule } from '../app-routing.module';
import { Ticket } from '../ticket';
import { Flight } from '../flight';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { of } from 'rxjs';
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';

describe('TicketDetailComponent', () => {
  let component: TicketDetailComponent;
  let fixture: ComponentFixture<TicketDetailComponent>;
  let flightRecordsServiceSpy: FlightRecordsService;
  let routerSpy: ActivatedRoute;

  const mockTicket: Ticket = {
    id: 1,
    flightId: 1,
    flightTime: new Date(Date.now()),
    purchaserId: '00000000-0000-0000-0000-000000000000',
    passengerName: 'Foo Testuser',
    seatClass: 'First',
    seatNumber: '1A',
    status: 'CHECKED_IN',
    statusPrettyPrint: '',  //expect these to be filled in
    timePrettyPrint: ''
  }

  const mockFlight: Flight = {
    id: 1,
    possibleLoyaltyPoints: 50,
    origin: {
      iataId: 'ABC',
      name: 'Abc Airport',
      streetAddress: '123 Fake St',
      city: 'Anywhere',
      state: 'TN',
      zipcode: '12345',
      servicingArea: { id: 1, areaName: 'Somewhere' },
    },
    destination: {
      iataId: 'XYZ',
      name: 'Xyz Airport',
      streetAddress: '789 Fake St',
      city: 'Anywhere',
      state: 'TN',
      zipcode: '12345',
      servicingArea: { id: 1, areaName: 'Somewhere' },
    },
    airplane: {
      id: 1,
      name: 'Planey McPlaneface',
      seatConfigurations: [
        {
          id: 1,
          seatClass: 'First',
          numRows: 1,
          numSeatsPerRow: 2,
        },
      ],
    },
    seats: [
      {
        id: '1-1A',
        seatRow: 1,
        seatColumn: 'A',
        seatClass: 'First',
        seatStatus: 'SOLD',
        price: 1,
      },
    ],
    creationDateTime: new Date(Date.now()),
    approximateDateTimeStart: new Date(Date.now() + 1),
    approximateDateTimeEnd: new Date(Date.now() + 2),
    flightActive: true,
    departurePrettyPrint: '', //expect these to be filled in
    arrivalPrettyPrint: '',
  };
  const mockError: HttpErrorResponse = {
      error: true,
      type: HttpEventType.Response,
      headers: new HttpHeaders(),
      ok: false,
      statusText: '',
      name: 'HttpErrorResponse',
      message: 'Internal server error',
      status: 500,
      url: null,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, AppRoutingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    flightRecordsServiceSpy = fixture.debugElement.injector.get(
      FlightRecordsService
    );
    routerSpy = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('getTicket should get the ticket', () => {
    spyOn(routerSpy.snapshot.paramMap, 'get').and.returnValue('1');
    const mockGetTicket = spyOn(
      flightRecordsServiceSpy,
      'getTicketById'
    ).and.returnValue(of(mockTicket));

    component.getTicket();
    expect(component.ticket).toEqual(mockTicket);
    expect(mockGetTicket).toHaveBeenCalledWith(1);
  });

  it('setTicket should set ticket', () => {
    component.setTicket(mockTicket);
    
    expect(component.ticket).toBeTruthy;
    expect(component.ticket).toEqual(mockTicket);
  });

  it('setTicket should set the error when given an error', () => {
    component.setTicket(mockError);

    expect(component.ticket).toBeFalsy;
    expect(component.error).toEqual(mockError);
  });

  it('getFlight should get the flight', () => {
    const mockGetFlight = spyOn(
      flightRecordsServiceSpy,
      'getFlightById'
    ).and.returnValue(of(mockFlight));

    component.ticket = mockTicket;
    component.getFlight();

    expect(mockGetFlight).toHaveBeenCalledWith(mockTicket.flightId);
    expect(component.flight).toBeTruthy();
    expect(component.flight).toEqual(mockFlight);
  });

  it('getFlight should do nothing if an error is set', () => {
    component.setTicket(mockError);

    component.getFlight();

    expect(component.flight).toEqual(undefined);
  });

  it('setFlight should set an error if it gets an error', () => {
    component.setFlight(mockError);

    expect(component.error).toEqual(mockError);
  });

  it('doPrettyPrinting should do it for ticket and flight', () => {
    const mockGetFlight = spyOn(
      flightRecordsServiceSpy,
      'getFlightById'
    ).and.returnValue(of(mockFlight));
    const mockPrettyStatus = 'checked in';
    const mockPrettyDate = mockTicket.flightTime.toDateString();
    const mockPrettyDeparture = mockFlight.approximateDateTimeStart
      .toTimeString();

    component.setTicket(mockTicket);

    expect(component.ticket?.statusPrettyPrint).toEqual(mockPrettyStatus);
    expect(component.ticket?.timePrettyPrint).toEqual(mockPrettyDate);
    expect(component.flight?.departurePrettyPrint).toEqual(mockPrettyDeparture);
  });

  it('checkIsValidTicket should return true on a ticket', () => {
    expect(component.checkIsValidTicket(mockTicket)).toBeTrue();
  });

  it('checkIsValidTicket should return false on an error', () => {
    expect(component.checkIsValidTicket(mockError)).toBeFalse();
  });

  it('checkIsValidFlight should return true on a flight', () => {
    expect(component.checkIsValidFlight(mockFlight)).toBeTrue();
  });

  it('checkIsValidFlight should return false on an error', () => {
    expect(component.checkIsValidFlight(mockError)).toBeFalse();
  });

  it('checkIsError should return true on an error', () => {
    expect(component.checkIsError(mockError)).toBeTrue();
  });

  it('checkIsError should return false on a non-error', () => {
    expect(component.checkIsError(mockTicket)).toBeFalse();
    expect(component.checkIsError(mockFlight)).toBeFalse();
  });
});

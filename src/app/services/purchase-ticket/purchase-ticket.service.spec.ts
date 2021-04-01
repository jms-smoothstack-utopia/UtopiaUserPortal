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
import { PurchaseTicketService } from './purchase-ticket.service';
import { Flight } from 'src/app/flight';
import { environment } from 'src/environments/environment';

describe('PurchaseTicketService', () => {
  let service: PurchaseTicketService;
  let httpTestingController: HttpTestingController;

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
          seatClass: 'BUSINESS',
          numRows: 2,
          numSeatsPerRow: 2,
        },
        {
          id: 2,
          seatClass: 'ECONOMY',
          numRows: 2,
          numSeatsPerRow: 2,
        },
      ],
    },
    //first available in business is 1B
    //first available in economy is 2A
    seats: [
      {
        id: 'FLIGHT 1-1A BUSINESS',
        seatRow: 1,
        seatColumn: 'A',
        seatClass: 'BUSINESS',
        seatStatus: 'SOLD',
        price: 1,
      },
      {
        id: 'FLIGHT 1-1B BUSINESS',
        seatRow: 1,
        seatColumn: 'B',
        seatClass: 'BUSINESS',
        seatStatus: 'AVAILABLE',
        price: 1,
      },
      {
        id: 'FLIGHT 1-2A BUSINESS',
        seatRow: 2,
        seatColumn: 'A',
        seatClass: 'BUSINESS',
        seatStatus: 'AVAILABLE',
        price: 1,
      },
      {
        id: 'FLIGHT 1-2B BUSINESS',
        seatRow: 2,
        seatColumn: 'B',
        seatClass: 'BUSINESS',
        seatStatus: 'AVAILABLE',
        price: 1,
      },
      {
        id: 'FLIGHT 1-1A ECONOMY',
        seatRow: 1,
        seatColumn: 'A',
        seatClass: 'ECONOMY',
        seatStatus: 'SOLD',
        price: 1,
      },
      {
        id: 'FLIGHT 1-1B ECONOMY',
        seatRow: 1,
        seatColumn: 'B',
        seatClass: 'ECONOMY',
        seatStatus: 'SOLD',
        price: 1,
      },
      {
        id: 'FLIGHT 1-2A ECONOMY',
        seatRow: 2,
        seatColumn: 'A',
        seatClass: 'ECONOMY',
        seatStatus: 'AVAILABLE',
        price: 1,
      },
      {
        id: 'FLIGHT 1-2B ECONOMY',
        seatRow: 2,
        seatColumn: 'B',
        seatClass: 'ECONOMY',
        seatStatus: 'SOLD',
        price: 1,
      },
    ],
    creationDateTime: new Date(Date.now()),
    approximateDateTimeStart: new Date(Date.now() + 1),
    approximateDateTimeEnd: new Date(Date.now() + 2),
    flightActive: true,
    departurePrettyPrint: '',
    arrivalPrettyPrint: '',
  };

  let mockEconomyCart = [ {
    flight: mockFlight,
    flightId: mockFlight.id,
    numberOfPeople: 1,
    seatClass: "economy"
  } ];

  let mockBusinessCart = [ {
    flight: mockFlight,
    flightId: mockFlight.id,
    numberOfPeople: 1,
    seatClass: "business"
  } ];

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
    service = TestBed.inject(PurchaseTicketService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFirstAvailableSeat should get first available for business class', () => {
    let cartObject = mockBusinessCart[0];

    expect(service.getFirstAvailableSeat(cartObject)).toEqual('1B');
  });

  it('getFirstAvailableSeat should get first available for economy class', () => {
    let cartObject = mockEconomyCart[0];

    expect(service.getFirstAvailableSeat(cartObject)).toEqual('2A');
  });

  it('purchaseTickets should purchase tickets', () => {
    service.purchaseTickets(mockEconomyCart, 'Foo Bar').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      environment.hostUrl + '/tickets'
    );
    req.flush(true, { status: 204, statusText: 'No Content' });
  });
});

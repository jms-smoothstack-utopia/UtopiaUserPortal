import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingcartComponent } from './shoppingcart.component';
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
import { CartService } from '../services/cart/cart.service';
import { AppRoutingModule } from '../app-routing.module';
import { Flight } from '../flight';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';
import { PurchaseTicketService } from '../services/purchase-ticket/purchase-ticket.service';

describe('ShoppingcartComponent', () => {
  let component: ShoppingcartComponent;
  let fixture: ComponentFixture<ShoppingcartComponent>;
  let cartService: CartService;
  let authService: AuthService;
  let userService: UserService;
  let purchaseTicketService: PurchaseTicketService;

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

  let mockCartItem = {
    flight: mockFlight,
    flightId: mockFlight.id,
    numberOfPeople: 1,
    seatClass: "economy"
  };

  let mockUser = {
    id: '00000000-0000-0000-0000-000000000000',
    firstName: 'Foo',
    lastName: 'Testuser',
    email: 'foo@example.com',
    addresses: [ {
      id: 0,
      line1: '123 Fake St',
      line2: '#1',
      city: 'Anywhere',
      state: 'VA',
      zipcode: '12345',
    } ],
    loyaltyPoints: 1,
    phoneNumber: '555-555-1234',
    addrLine1: '123 Fake St',
    addrLine2: '#1',
    city: 'Anywhere',
    state: 'VA',
    zipcode: '12345',
    ticketEmails: true,
    flightEmails: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingcartComponent],
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
    fixture = TestBed.createComponent(ShoppingcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = fixture.debugElement.injector.get(AuthService);
    userService = fixture.debugElement.injector.get(UserService);
    cartService = fixture.debugElement.injector.get(CartService);
    purchaseTicketService = fixture.debugElement.injector.get(PurchaseTicketService);
    cartService.addToCart(mockCartItem);

    spyOn(authService, 'isLoggedIn').and.returnValue(true);
  });

  afterEach(() => {
    //reset cart in case a test did something with the cart
    cartService.clearCart();
    cartService.addToCart(mockCartItem);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('viewList should be empty when service has no selected cart items', () => {
    cartService.clearCart();
    //making a new component instance here
    //since the component sets its own viewList on initialization, using the
    //same instance as before won't work even if we clear the cart here
    let thisFixture = TestBed.createComponent(ShoppingcartComponent);
    let emptyCartComponent = thisFixture.componentInstance;

    expect(emptyCartComponent.viewList.length).toEqual(0);
  });

  it('doPurchase should do the purchase', () => {
    authService.userId = mockUser.id;
    const mockGetUser = spyOn(
      userService,
      'getUser'
    ).and.returnValue(of(mockUser));
    const mockPurchaseTickets = spyOn(purchaseTicketService, 'purchaseTickets')
      .and.returnValue(of({}));

    component.doPurchase();

    expect(mockPurchaseTickets).toHaveBeenCalledWith(
      cartService.showCart(),
      mockUser.firstName + ' ' + mockUser.lastName
    );
    expect(mockGetUser).toHaveBeenCalledWith(mockUser.id);
  });
});

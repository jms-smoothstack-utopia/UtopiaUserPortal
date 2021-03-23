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
import { UserService } from './user.service';
import { User } from '../user';

const mockUser: User = {
  id: 'some-uuid',
  firstName: 'firstname',
  lastName: 'lastname',
  email: 'some@email.com',
  addresses: [
    {
      id: 1,
      line1: 'addrline1',
      line2: 'addr2',
      city: 'city',
      state: 'ga',
      zipcode: '12345',
    },
  ],
  loyaltyPoints: 50,
  phoneNumber: '123-456-7890',
  addrLine1: 'addrline1',
  addrLine2: 'addrline2',
  city: 'city',
  state: 'ga',
  zipcode: '12345',
  ticketEmails: true,
  flightEmails: true,
};

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

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

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return something', () => {
    service.getUser('2').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/customers/2'
    );
    req.flush('something');
  });

  it('getUsers should return a list of users', () => {
    service.getUsers().subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/customers'
    );
    req.flush('something');
  });

  it('should call PUT for #updateUser', () => {
    const userId = mockUser.id;
    const expectedUrl = `${service.USERS_URL}/${userId}`;

    service.updateUser(mockUser).subscribe((res: any) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(expectedUrl);
    req.flush('response');

    expect(req.request.method).toBe('PUT');
  });
});

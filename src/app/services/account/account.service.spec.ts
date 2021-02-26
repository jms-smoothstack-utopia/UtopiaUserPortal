import { TestBed } from '@angular/core/testing';

import {
  AccountService,
  CreateCustomerAccountDto,
  CustomerAccount,
} from './account.service';
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
import { environment } from '../../../environments/environment';

describe('AccountService', () => {
  let service: AccountService;
  let httpTestingController: HttpTestingController;
  const fullUrl = environment.hostUrl + '/customers';

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
    service = TestBed.inject(AccountService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to the correct endpoint', () => {
    const mockDto: CreateCustomerAccountDto = {
      email: 'test@test.com',
      password: 'password1',
      firstName: 'john',
      lastName: 'doe',
      phoneNumber: '999-999-9999',
      addrLine1: '123 Main st',
      addrLine2: undefined,
      city: 'Atlanta',
      state: 'GA',
      zipcode: '98765-4321',
    };

    const mockResponse: CustomerAccount = {
      id: '108aaec4-23ef-4e7a-b50b-e716f842253f',
      firstName: 'john',
      lastName: 'doe',
      phoneNumber: '999-999-9999',
      email: 'test@test.com',
      addresses: [
        {
          cardinality: 1,
          line1: '123 Main st',
          line2: undefined,
          city: 'Atlanta',
          state: 'GA',
          zipcode: '98765-4321',
        },
      ],
      loyaltyPoints: 0,
    };

    service.createAccount(mockDto).subscribe((res: any) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(fullUrl);
    expect(req.request.method).toBe('POST');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');

    req.flush(mockResponse);
  });
});

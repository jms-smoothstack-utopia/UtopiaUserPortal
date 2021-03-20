import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
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

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockAuthService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        AuthService,
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
      imports: [HttpClientTestingModule],
    });

    interceptor = TestBed.inject(AuthInterceptor);
    mockAuthService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should not add Authorization Header on login', () => {
    mockAuthService.token = undefined;

    mockAuthService.login('test@test.com', 'password1').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpTestingController.expectOne(environment.hostUrl + '/login');
    expect(req.request.headers.get('Authorization')).toBeFalsy();

    req.flush('dummy');
  });
});

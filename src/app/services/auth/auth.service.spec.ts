import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  LoggerConfig,
  NGXLogger,
  NGXLoggerHttpService,
  NgxLoggerLevel,
  NGXMapperService,
} from 'ngx-logger';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  NGXLoggerHttpServiceMock,
  NGXMapperServiceMock,
} from 'ngx-logger/testing';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  const fullUrl = `${environment.hostUrl}/authenticate`;
  let service: AuthService;
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

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set auth properties on successful POST and stored in localStorage', () => {
    const nowAsMillis = new Date().getTime();
    const mockAuth = {
      token: 'Bearer abc.def.xyz',
      expiresAt: nowAsMillis,
    };

    const mockEmail = 'test@test.com';
    const mockPassword = 'password1';

    service.login(mockEmail, mockPassword).subscribe((res: any) => {
      expect(res.token).toEqual(mockAuth.token);
      expect(res.expiresAt).toEqual(mockAuth.expiresAt);
    });

    const req = httpTestingController.expectOne(fullUrl);
    expect(req.request.method).toBe('POST');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');

    // should not exist before req
    expect(localStorage.getItem(service.STORAGE_KEY)).toBeFalsy();

    req.flush(mockAuth);

    expect(service.token).toEqual(mockAuth.token);
    expect(service.userEmail).toEqual(mockEmail);
    expect(service.expiresAt).toEqual(new Date(nowAsMillis));
    expect(localStorage.getItem(service.STORAGE_KEY)).toBeTruthy();
  });

  it('should clear auth properties on logout', () => {
    service.logout();
    expect(service.token).toBeFalsy();
    expect(service.userEmail).toBeFalsy();
    expect(service.expiresAt).toBeFalsy();
    expect(localStorage.getItem(service.STORAGE_KEY)).toBeFalsy();
  });

  it('should retrieve localStorage and set auth properties on autoLogin', () => {
    const mockAuthData = {
      token: 'Bearer abc.def.xyz',
      expiresAt: new Date('01-01-2021'),
      userEmail: 'test@test.com',
      tokenExpirationTimer: 999,
    };
    localStorage.setItem(service.STORAGE_KEY, JSON.stringify(mockAuthData));
    service.autoLogin();
    expect(service.token).toEqual(mockAuthData.token);
    expect(service.expiresAt).toBeInstanceOf(Date);
    expect(service.expiresAt).toEqual(mockAuthData.expiresAt);
    expect(service.userEmail).toEqual(mockAuthData.userEmail);
    localStorage.removeItem(service.STORAGE_KEY);
  });

  it('should have auth data undefined if no localStorage value', () => {
    localStorage.removeItem(service.STORAGE_KEY);
    expect(service.token).toBeFalsy();
    expect(service.expiresAt).toBeFalsy();
    expect(service.userEmail).toBeFalsy();
  });

  it('#isLoggedIn() return true if a token is present', () => {
    service.token = 'Bearer ';
    const result = service.isLoggedIn();
    expect(result).toBeTrue();
  });

  it('#isLoggedIn() return false if no token is present', () => {
    service.token = undefined;
    const result = service.isLoggedIn();
    expect(result).toBeFalse();
  });
});

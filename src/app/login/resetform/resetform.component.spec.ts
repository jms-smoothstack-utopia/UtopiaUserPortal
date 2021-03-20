import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
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

import { ResetformComponent } from './resetform.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlankComponent } from 'src/app/blank/blank.component';

describe('ResetformComponent', () => {
  let component: ResetformComponent;
  let fixture: ComponentFixture<ResetformComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: BlankComponent,
          },
        ]),
        HttpClientTestingModule,
        FormsModule,
      ],
      declarations: [ResetformComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ token: 1 }),
          },
        },
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetformComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(
      HttpTestingController
    );
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate user to the 404 page if token is not valid', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const req = httpMock.expectOne(
      environment.accountsEndpoint + '/new-password/' + component.userToken
    );
    req.flush(null, { status: 404, statusText: 'Not Found' });

    expect(req.request.method).toBe('GET');
    expect(navigateSpy).toHaveBeenCalledWith(
      ['404/notfound'],
      Object({ replaceUrl: true })
    );
    //Need to add test to test for navigation
  });

  it('should keep user on page if token is valid', () => {
    const req = httpMock.expectOne(
      environment.accountsEndpoint + '/new-password/' + component.userToken
    );
    req.flush(null, { status: 200, statusText: 'Token Found' });

    expect(req.request.method).toBe('GET');
    expect(component.userToken).toBe(1);
    //Need to add test to test for navigation
  });

  it('should not initiate anything, if the form is invalid, then show error message', () => {
    const testForm = <NgForm>{
      value: {
        password: '',
        passwordvalidation: '',
      },
      valid: false,
    };
    component.onSubmitPasswordResetWithToken(testForm);
    expect(component.errorMsg).toEqual('Please enter your new password.');
  });

  it('if passwords are not the same, then return error message', () => {
    const testForm = <NgForm>{
      value: {
        password: 'Qwerty123456!',
        passwordvalidation: 'Qwerty123456?',
      },
      valid: true,
    };
    component.onSubmitPasswordResetWithToken(testForm);
    expect(component.errorMsg).toEqual(
      'Please enter the same password in both input boxes'
    );
  });

  it('if passwords are the same, but do not fit criteria', () => {
    const testForm = <NgForm>{
      value: {
        password: 'Qwerty1!',
        passwordvalidation: 'Qwerty1!',
      },
      valid: true,
    };
    component.onSubmitPasswordResetWithToken(testForm);
    expect(component.errorMsg).toEqual(
      'Password must be between 10 and 128 characters,' +
        ' contain at least one lowercase letter,' +
        ' at least one uppercase letter,' +
        ' at least one number,' +
        ' and at least one special character from the following: !@#$%^&*-_=+,.?'
    );
  });

  it('should return error response 404 if token is invalid by server', () => {
    const testForm = <NgForm>{
      value: {
        password: 'Qwerty123456!',
        passwordvalidation: 'Qwerty123456!',
      },
      valid: true,
    };
    component.onSubmitPasswordResetWithToken(testForm);
    const req = httpMock.expectOne(
      environment.accountsEndpoint + '/new-password'
    );
    req.flush(null, { status: 404, statusText: 'Not found' });
    expect(req.request.method).toBe('POST');
    expect(component.errorMsg).toEqual(
      'The token you provided is expired or invalid. Please resetting your password again.'
    );
  });

  it('should navigate user to another page if process is successful', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const testForm = <NgForm>{
      value: {
        password: 'Qwerty123456!',
        passwordvalidation: 'Qwerty123456!',
      },
      valid: true,
    };
    component.onSubmitPasswordResetWithToken(testForm);
    const req = httpMock.expectOne(
      environment.accountsEndpoint + '/new-password'
    );
    req.flush(null, { status: 200, statusText: 'Password changed' });
    expect(req.request.method).toBe('POST');
    expect(navigateSpy).toHaveBeenCalledWith(
      'login/password/confirmationchange'
    );
  });
});

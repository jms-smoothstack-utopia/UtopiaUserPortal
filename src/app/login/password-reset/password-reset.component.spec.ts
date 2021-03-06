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

import { PasswordResetComponent } from './password-reset.component';
import { environment } from 'src/environments/environment';
import { BlankComponent } from 'src/app/blank/blank.component';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login/forgotpassword/checkemail',
            component: BlankComponent,
          },
        ]),
        HttpClientTestingModule,
        FormsModule,
      ],
      declarations: [PasswordResetComponent],
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
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(
      HttpTestingController
    );
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow invalid emails', () => {
    const testForm = <NgForm>{
      value: {
        email: 'NotAValidEmailString',
      },
      valid: false,
    };
    component.onSubmitPasswordReset(testForm);

    expect(component.errorMsg).toEqual(
      'Please enter a valid email to reset your password'
    );
  });

  it('should not allow empty emails', () => {
    const testForm = <NgForm>{
      value: {
        email: '',
      },
      valid: false,
    };
    component.onSubmitPasswordReset(testForm);

    expect(component.errorMsg).toEqual(
      'Please enter a valid email to reset your password'
    );
  });

  it('should return 404 if email is not present in backend', () => {
    const testForm = <NgForm>{
      value: {
        email: 'spoof@email.com',
      },
      valid: true,
    };

    component.onSubmitPasswordReset(testForm);
    const req = httpMock.expectOne(
      environment.accountsEndpoint + '/password-reset'
    );
    req.flush(null, { status: 404, statusText: 'Not found' });

    expect(req.request.method).toBe('POST');
    expect(component.errorMsg).toEqual(
      'The email was not found. Please confirm your email!'
    );
  });

  //Need to fix this test case for routing

  it('should navigate to success page if process is initiated', () => {
    const testForm = <NgForm>{
      value: {
        email: 'spoof@email.com',
      },
      valid: true,
    };

    component.onSubmitPasswordReset(testForm);
    const req = httpMock.expectOne(
      environment.accountsEndpoint + '/password-reset'
    );
    req.flush(null, { status: 200, statusText: 'Process initiated' });

    expect(req.request.method).toBe('POST');
    expect(component.errorMsg).toBe(undefined);
    expect(component.isLoading).toBe(false);
  });

  it('should remove message #onCloseAlert', () => {
    component.onCloseAlert();
    expect(component.errorMsg).toBeUndefined();
  });

  it('should have an error message if not 404', () => {
    let err: HttpErrorResponse = {
      error: undefined,
      type: HttpEventType.Response,
      headers: new HttpHeaders(),
      ok: false,
      statusText: '',
      name: 'HttpErrorResponse',
      message: 'Something bad happened.',
      status: 403,
      url: null,
    };

    component.errorPasswordReset(err);
    expect(component.errorMsg).toBe(
      'An error occurred while processing your request. Please try again.'
    );
  });
});

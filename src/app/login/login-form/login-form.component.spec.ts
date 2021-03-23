import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import PathConstants from '../../../environments/paths';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, of, throwError } from 'rxjs';

describe('MainPageComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = fixture.debugElement.injector.get(Router);
    authService = fixture.debugElement.injector.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to homepage if logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const navigate = spyOn(router, 'navigate');

    component.ngOnInit();

    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('should NOT navigate if not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    const navigate = spyOn(router, 'navigate');

    component.ngOnInit();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('should not login if form is invalid', () => {
    const form = <NgForm>{
      get valid(): boolean | null {
        return false;
      },
    };

    component.onSubmitLogin(form);

    expect(component.errorMsg).toBeTruthy();
  });

  it('should attempt login if form valid', () => {
    const email = 'some@email.com';
    const password = 'abCD1234!@';
    const form = <NgForm>{
      value: {
        email,
        password,
      },
      get valid(): boolean | null {
        return true;
      },
    };

    const login = spyOn(authService, 'login').and.returnValue(
      of({ userId: 'some-uuid', token: 'some token', expiresAt: 5 })
    );

    component.onSubmitLogin(form);

    expect(login).toHaveBeenCalledWith(email, password);
  });

  it('should handle error on login error', () => {
    const email = 'some@email.com';
    const password = 'abCD1234!@';
    const form = <NgForm>{
      value: {
        email,
        password,
      },
      get valid(): boolean | null {
        return true;
      },
      reset(value?: any) {},
    };

    const login = spyOn(authService, 'login').and.returnValue(
      throwError('SOME ERROR')
    );

    component.onSubmitLogin(form);

    expect(login).toHaveBeenCalledWith(email, password);
  });

  it('should navigate to homepage on successful login', () => {
    const navigate = spyOn(router, 'navigate');
    component.handleLoginSuccess();
    expect(navigate).toHaveBeenCalledWith(['/']);
    expect(component.isLoading).toBeFalse();
    expect(component.errorMsg).toBeUndefined();
  });

  it('should set error message on login failure', () => {
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

    component.handleLoginFailure(err);

    expect(component.isLoading).toBeFalse();
    expect(component.errorMsg).toBe('Invalid email or password');

    err = {
      error: undefined,
      type: HttpEventType.Response,
      headers: new HttpHeaders(),
      ok: false,
      statusText: '',
      name: 'HttpErrorResponse',
      message: 'Something bad happened.',
      status: 401,
      url: null,
    };

    component.handleLoginFailure(err);

    expect(component.isLoading).toBeFalse();
    expect(component.errorMsg).toBe('Invalid email or password');

    err = {
      error: undefined,
      type: HttpEventType.Response,
      headers: new HttpHeaders(),
      ok: false,
      statusText: '',
      name: 'HttpErrorResponse',
      message: 'Something bad happened.',
      status: 404,
      url: null,
    };

    component.handleLoginFailure(err);

    expect(component.isLoading).toBeFalse();
    expect(component.errorMsg).toBe(
      'An error occurred while logging in. Please try again.'
    );
  });

  it('should navigate to forgot password on click', () => {
    const navigate = spyOn(router, 'navigateByUrl');

    component.goToForgetPasswordPage();

    expect(navigate).toHaveBeenCalledWith('/login/forgotpassword');
  });

  it('should navigate to create component', () => {
    const navigate = spyOn(router, 'navigate');

    component.makeAnAccount();

    expect(navigate).toHaveBeenCalledWith([PathConstants.CREATE_ACCOUNT]);
  });

  it('should clear error message #onCloseAlert', () => {
    component.errorMsg = 'some message';

    component.onCloseAlert();

    expect(component.errorMsg).toBeUndefined();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRegistrationComponent } from './confirm-registration.component';
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
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('ConfirmRegistrationComponent', () => {
  let component: ConfirmRegistrationComponent;
  let fixture: ComponentFixture<ConfirmRegistrationComponent>;
  let authServiceSpy: AuthService;
  let activatedRouteSpy: ActivatedRoute;
  let routerSpy: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmRegistrationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'some-token',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authServiceSpy = fixture.debugElement.injector.get(AuthService);
    activatedRouteSpy = fixture.debugElement.injector.get(ActivatedRoute);
    routerSpy = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set an alert message after receiving response from authService', () => {
    const confirmFn = spyOn(
      authServiceSpy,
      'confirmRegistration'
    ).and.returnValue(of({ body: '' }));

    component.ngOnInit();

    expect(confirmFn).toHaveBeenCalled();

    expect(component.alertMsg).toBeTruthy();
  });

  it('should have an alert message if no token', () => {
    spyOn(activatedRouteSpy.snapshot.paramMap, 'get').and.returnValue(null);
    component.ngOnInit();
    expect(component.alertMsg).toBe(
      'Please follow the link provided in your email to confirm your account.'
    );
  });

  it('should have an alert message if an error occurs on confirmation', () => {
    spyOn(authServiceSpy, 'confirmRegistration').and.returnValue(
      throwError('SOME ERROR')
    );

    component.ngOnInit();

    expect(component.alertMsg).toBe(
      'There was a problem processing your request. The code monkeys have been notified!'
    );
  });

  it('should clear alert message #onCloseAlert', () => {
    component.alertMsg = 'CRISIS ALERT!!!';
    const navigate = spyOn(routerSpy, 'navigate');
    component.onCloseAlert();
    expect(component.alertMsg).toBeUndefined();
    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});

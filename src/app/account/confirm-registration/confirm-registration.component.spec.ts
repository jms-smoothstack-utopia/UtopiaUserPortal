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
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ConfirmRegistrationComponent', () => {
  let component: ConfirmRegistrationComponent;
  let fixture: ComponentFixture<ConfirmRegistrationComponent>;
  let authServiceSpy: AuthService;
  let activatedRouteSpy: ActivatedRoute;

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
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';
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
import { AccountService } from '../../services/account/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import PathConstants from '../../../environments/paths';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let accountServiceSpy: AccountService;
  let authServiceSpy: AuthService;
  let mockRouter: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAccountComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
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
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accountServiceSpy = fixture.debugElement.injector.get(AccountService);
    authServiceSpy = fixture.debugElement.injector.get(AuthService);
    mockRouter = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to profile if already logged in', () => {
    spyOn(authServiceSpy, 'isLoggedIn').and.returnValue(true);
    spyOn(mockRouter, 'navigate');
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      PathConstants.USER_PROFILE,
    ]);
  });
});

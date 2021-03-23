import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
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
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authServiceSpy = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "Sign out" as button text if logged in', () => {
    spyOn(authServiceSpy, 'isLoggedIn').and.returnValue(true);
    component.ngOnInit();
    fixture.detectChanges();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    expect(component.buttonMsg).toEqual('Sign out');

    expect(fixture.nativeElement.querySelector('button').innerText).toEqual(
      'Sign out'
    );
  });

  it('should have "Sign in" as button text if not logged in', () => {
    spyOn(authServiceSpy, 'isLoggedIn').and.returnValue(false);
    component.ngOnInit();
    fixture.detectChanges();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    expect(component.buttonMsg).toEqual('Sign in');
    expect(fixture.nativeElement.querySelector('button').innerText).toEqual(
      'Sign in'
    );
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountComponent } from './delete-account.component';
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
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';

describe('DeleteAccountComponent', () => {
  let component: DeleteAccountComponent;
  let fixture: ComponentFixture<DeleteAccountComponent>;
  let authServiceSpy: AuthService;
  const confirmForm = <NgForm>{
    value: {
      email: 'test@test.com',
      password: 'somepassword',
    },
    resetForm: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAccountComponent],
      imports: [HttpClientTestingModule, FormsModule],
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
    fixture = TestBed.createComponent(DeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authServiceSpy = fixture.debugElement.injector.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #deleteAccount on submit', () => {
    const deleteAccountFn = spyOn(
      authServiceSpy,
      'deleteAccount'
    ).and.returnValue(of({}));

    const resetForm = spyOn(confirmForm, 'resetForm');

    component.onSubmitConfirmation(confirmForm);

    expect(deleteAccountFn).toHaveBeenCalledWith(
      confirmForm.value.email,
      confirmForm.value.password
    );
    expect(resetForm).toHaveBeenCalled();
  });

  it('should emit event on close', () => {
    const emitter = spyOn(component.closeEvent, 'emit');
    component.onClose();
    expect(emitter).toHaveBeenCalled();
  });

  it('should have an error message on failure', () => {
    const email = 'some@email.com';
    const password = 'password';

    const form = <NgForm>{
      value: {
        email,
        password,
      },
      resetForm(value?: any) {},
    };

    const fn = spyOn(authServiceSpy, 'deleteAccount').and.returnValue(
      throwError('SOME ERROR')
    );
    const reset = spyOn(form, 'resetForm');

    component.onSubmitConfirmation(form);

    expect(reset).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Your request could not be processed. Please verify you entered the correct credentials.'
    );
  });

  it('should reset error message #onRetryFromError', () => {
    component.errorMessage = 'Some error';
    component.onRetryFromError();
    expect(component.errorMessage).toBeUndefined();
  });
});

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
import { of } from 'rxjs';

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
});

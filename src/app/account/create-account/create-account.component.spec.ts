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
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

//TODO: Test error case for duplicate email.
// I cannot for the life of me figure out how to mock an error response from the
// observable from the account service.
describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let accountServiceSpy: AccountService;
  let authServiceSpy: AuthService;
  let mockRouter: Router;
  const expectedFormFields = [
    'email',
    'firstName',
    'lastName',
    'addrLine1',
    'addrLine2',
    'phoneNumber',
    'city',
    'state',
    'zipcode',
    'password',
    'confirmPassword',
  ];

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

  afterEach(() => {
    component.accountForm.reset();
  });

  const setFormValidAndDetectChanges = () => {
    component.accountForm.get('email')!.setValue('test@test.com');
    expect(component.accountForm.get('email')!.valid).toBeTrue();

    component.accountForm.get('firstName')!.setValue('John');
    expect(component.accountForm.get('firstName')!.valid).toBeTrue();

    component.accountForm.get('lastName')!.setValue('Sample');
    expect(component.accountForm.get('lastName')!.valid).toBeTrue();

    component.accountForm.get('addrLine1')!.setValue('123 Main St.');
    expect(component.accountForm.get('addrLine1')!.valid).toBeTrue();

    component.accountForm.get('phoneNumber')!.setValue('4178926530');
    component.onPhoneNumberFocusOut();
    expect(component.accountForm.get('phoneNumber')!.valid).toBeTrue();

    component.accountForm.get('city')!.setValue('Las Vegas');
    expect(component.accountForm.get('city')!.valid).toBeTrue();

    component.accountForm.get('state')!.setValue('Nevada');
    expect(component.accountForm.get('state')!.valid).toBeTrue();

    component.accountForm.get('zipcode')!.setValue('98765');
    expect(component.accountForm.get('zipcode')!.valid).toBeTrue();

    component.accountForm.get('password')!.setValue('abCD1234!@');
    expect(component.accountForm.get('password')!.valid).toBeTrue();

    component.accountForm.get('confirmPassword')!.setValue('abCD1234!@');
    expect(component.accountForm.get('confirmPassword')!.valid).toBeTrue();

    fixture.detectChanges();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain an initialized form for entry containing all expected fields', () => {
    const form = component.accountForm;
    expect(form).toBeTruthy();

    expectedFormFields.forEach((field) => {
      expect(form.contains(field)).toBeTrue();
    });

    const totalFields = expectedFormFields.map((field) => {
      form.get(field);
    }).length;

    expect(totalFields).toEqual(expectedFormFields.length);
  });

  it('should automatically format a valid phone number in a readable format for US numbers', () => {
    const control = component.accountForm.get('phoneNumber');

    expect(control).toBeTruthy();

    control!.setValue('4178926530');
    component.onPhoneNumberFocusOut();

    expect(control!.value).toEqual('(417) 892-6530');
  });

  it('#formattedPhoneNuber should return a properly formatted string when input is valid for API calls', () => {
    const control = component.accountForm.get('phoneNumber');
    expect(control).toBeTruthy();

    control!.setValue('4178926530');
    component.onPhoneNumberFocusOut();
    expect(component.formattedPhoneNumber).toEqual('417-892-6530');
  });

  it('#formattedPhoneNuber should return an empty string when input is not valid', () => {
    const control = component.accountForm.get('phoneNumber');
    expect(control).toBeTruthy();

    control!.setValue('0123400000056789');
    expect(control!.value).toEqual('0123400000056789');
    expect(control!.valid).toBeFalse();
    expect(component.formattedPhoneNumber).toEqual('');

    control!.setValue('000');
    expect(control!.value).toEqual('000');
    expect(control!.valid).toBeFalse();
    expect(component.formattedPhoneNumber).toEqual('');

    control!.setValue('a123456789');
    expect(control!.value).toEqual('a123456789');
    expect(control!.valid).toBeFalse();
    expect(component.formattedPhoneNumber).toEqual('');

    control!.setValue('770a445987');
    expect(control!.value).toEqual('770a445987');
    expect(control!.valid).toBeFalse();
    expect(component.formattedPhoneNumber).toEqual('');
  });

  it('#showErrorForField should return true if field invalid and touched', () => {
    expectedFormFields.forEach((field) => {
      component.accountForm.get(field)!.markAsTouched();
      if (field !== 'addrLine2' && field !== 'confirmPassword') {
        expect(component.accountForm.get(field)!.valid).toBeFalsy(
          field + ' failed test.'
        );
        expect(component.showErrorForField(field)).toBeTrue();
      }
    });

    component.accountForm.reset();

    component.accountForm.get('password')!.setValue('abCD1234!@');
    component.accountForm.get('confirmPassword')!.setValue('');
    component.accountForm.get('confirmPassword')!.markAsTouched();

    expect(component.showErrorForField('confirmPassword')).toBeTrue();

    // if confirm matches password, should not show error even if password invalid
    component.accountForm.get('password')!.setValue('a');
    component.accountForm.get('confirmPassword')!.setValue('a');
    expect(component.showErrorForField('confirmPassword')).toBeFalse();
  });

  it('#getFieldValue should return a trimmed string for values', () => {
    expectedFormFields.forEach((field) => {
      const control = component.accountForm.get(field)!;

      control.setValue(' leading space');
      expect(component.getFieldValue(field)).toEqual(
        'leading space',
        field + ' failed leading space.'
      );

      control.setValue('trailing space ');
      expect(component.getFieldValue(field)).toEqual(
        'trailing space',
        field + ' failed trailing space.'
      );

      control.setValue('         ');
      expect(component.getFieldValue(field)).toEqual(
        '',
        field + ' failed all space.'
      );
    });
  });

  it('TODO: #onSubmit happy path', async () => {
    setFormValidAndDetectChanges();
    const mockResponse = {
      id: '1234',
      firstName: 'John',
      lastName: 'Sample',
      phoneNumber: '417-892-6530',
      email: 'test@test.com',
      addresses: [
        {
          cardinality: 1,
          line1: '123 Main St.',
          line2: undefined,
          city: 'Las Vegas',
          state: 'Nevada',
          zipcode: '98765',
        },
      ],
      loyaltyPoints: 0,
    };

    spyOn(accountServiceSpy, 'createAccount').and.returnValue(of(mockResponse));
    const login = spyOn(authServiceSpy, 'login');
    const navigation = spyOn(mockRouter, 'navigate');

    component.onSubmit();

    expect(login).toHaveBeenCalledWith('test@test.com', 'abCD1234!@');
    expect(navigation).toHaveBeenCalledWith([
      PathConstants.USER_PROFILE,
      mockResponse.id,
    ]);

    expect(component.isLoading).toBeFalse();
    expect(component.errorMsg).toBeUndefined();
  });

  it('submit button should be disabled at initialization', () => {
    const button = fixture.debugElement.query(By.css('#submitButton'));
    expect(button).toBeTruthy();
    expect(button.properties.disabled).toBeTrue();
  });

  it('submit button should be enabled when form is valid', () => {
    setFormValidAndDetectChanges();

    const button = fixture.debugElement.query(By.css('#submitButton'));
    expect(button).toBeTruthy();
    expect(button.properties.disabled).toBeFalse();
  });

  it('#selectedStateAbbreviation returns an abbreviation from the selected state', () => {
    component.accountForm.get('state')!.setValue('Georgia');
    let result = component.selectedStateAbbreviation;
    expect(result).toEqual('GA');

    component.accountForm.get('state')!.setValue('Nevada');
    result = component.selectedStateAbbreviation;
    expect(result).toEqual('NV');

    component.accountForm.get('state')!.setValue('District Of Columbia');
    result = component.selectedStateAbbreviation;
    expect(result).toEqual('DC');
  });

  it('#selectedStateAbbreviation should return empty string if no selection', () => {
    let result = component.accountForm.get('state')!.value;
    expect(result).toBe('');
  });

  it('#getErrorText should return a non-blank string for every required field', () => {
    expectedFormFields.forEach((field) => {
      if (field !== 'addrLine2') {
        const errorText = component.getErrorText(field);
        expect(errorText.trim()).toBeTruthy(field + ' failed to return text.');
      }
    });
  });

  it('#onCloseAlert should clear the component error message', () => {
    component.errorMsg = undefined;
    component.onCloseAlert();
    expect(component.errorMsg).toBeUndefined();

    component.errorMsg = 'some error';
    component.onCloseAlert();
    expect(component.errorMsg).toBeUndefined();
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

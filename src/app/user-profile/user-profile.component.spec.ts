import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
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
import { UserService } from '../services/user.service';
import { User } from '../user';
import { Address } from '../address';
import { of, throwError } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceSpy: UserService;
  const expectedFormFields = [
    'firstName',
    'lastName',
    'email',
    'addrLine1',
    'addrLine2',
    'city',
    'state',
    'zipcode',
    'phoneNumber',
    'loyaltyPoints',
    'ticketEmails',
    'flightEmails',
  ];

  const mockAddrs: Address[] = [
    {
      id: 0,
      line1: '123 Fake St',
      line2: '#1',
      city: 'Anywhere',
      state: 'VA',
      zipcode: '12345',
    },
  ];
  const mockUser: User = {
    id: '00000000-0000-0000-0000-000000000000',
    firstName: 'Foo',
    lastName: 'Testuser',
    email: 'foo@example.com',
    addresses: mockAddrs,
    loyaltyPoints: 1,
    phoneNumber: '555-555-1234',
    addrLine1: '123 Fake St',
    addrLine2: '#1',
    city: 'Anywhere',
    state: 'VA',
    zipcode: '12345',
    ticketEmails: true,
    flightEmails: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userServiceSpy = fixture.debugElement.injector.get(UserService);
  });

  afterEach(() => {
    component.userProfileForm.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkIsValidUser true on valid user', () => {
    expect(component.checkIsValidUser(mockUser)).toBeTrue();
  });

  it('checkUser should set the user', () => {
    component.setUser(mockUser);
    expect((component.user as User).firstName).toEqual('Foo');
    expect((component.user as User).lastName).toEqual('Testuser');
    expect((component.user as User).email).toEqual('foo@example.com');
    expect((component.user as User).loyaltyPoints).toEqual(1);
    expect((component.user as User).ticketEmails).toBeTrue();
    expect((component.user as User).flightEmails).toBeTrue();
  });

  it('setUser should call fillThisUserAddr, should fill in user address', () => {
    component.setUser(mockUser);
    expect((component.user as User).addrLine1).toEqual('123 Fake St');
    expect((component.user as User).addrLine2).toEqual('#1');
    expect((component.user as User).city).toEqual('Anywhere');
    expect((component.user as User).state).toEqual('VA');
    expect((component.user as User).zipcode).toEqual('12345');
  });

  it('form should create', () => {
    expect(component.userProfileForm).toBeTruthy();
  });

  it('form should have all expected fields', () => {
    expectedFormFields.forEach((field) => {
      expect(component.userProfileForm.contains(field)).toBeTrue();
    });
  });

  it('form zip code field should be invalid if bad zip code entered', () => {
    component.userProfileForm.get('zipcode')!.setValue('0');
    component.userProfileForm.get('zipcode')!.markAsTouched();

    expect(component.userProfileForm.get('zipcode')!.invalid).toBeTrue();
  });

  it('form email field should be invalid if bad email entered', () => {
    component.userProfileForm.get('email')!.setValue('Not an email!');
    component.userProfileForm.get('email')!.markAsTouched();

    expect(component.userProfileForm.get('email')!.invalid).toBeTrue();
  });

  it('form should be valid when set with a user', () => {
    component.setUser(mockUser);

    expect(component.userProfileForm.invalid).toBeFalse();
  });

  it('#updatePhoneNumber should return empty if invalid', () => {
    component.userProfileForm.controls['phoneNumber'].reset();

    const result = component.updatePhoneNumberFormat();

    expect(result).toBe('');
  });

  it('#updatePhoneNumber should return formatted number on valid', () => {
    const control = component.userProfileForm.controls['phoneNumber'];
    control.patchValue('(777) 777-7777');

    const result = component.updatePhoneNumberFormat();

    expect(result).toBe('777-777-7777');
  });

  it('should clear error message #onCloseAlert', () => {
    component.onCloseAlert();
    expect(component.modalMsg).toBeFalsy();
  });

  it('should call #updateUser on valid user', () => {
    const fn = spyOn(userServiceSpy, 'updateUser').and.returnValue(
      of(mockUser)
    );
    const fn2 = spyOn(component, 'checkIsValidUser').and.returnValue(true);
    component.setUser(mockUser);
    component.updateUser();
    expect(fn).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
    expect(component.modalMsg).toBeTruthy();
  });

  it('should have a message if  update failed', () => {
    const fn = spyOn(userServiceSpy, 'updateUser').and.returnValue(
      throwError('SOME ERROR')
    );
    const fn2 = spyOn(component, 'checkIsValidUser').and.returnValue(true);
    component.setUser(mockUser);
    component.updateUser();
    expect(fn).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
    expect(component.modalMsg).toBeTruthy();
  });
});

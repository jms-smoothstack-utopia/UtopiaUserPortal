import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../services/user.service';
import { User } from '../user';
import { Address } from '../address';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceSpy: UserService;
  const expectedFormFields = [
    'firstNameControl', 'lastNameControl', 'emailControl',
    'addrLine1Control', 'addrLine2Control', 'cityControl',
    'stateControl', 'zipCodeControl', 'loyaltyPointsControl',
    'ticketEmailsControl', 'flightEmailsControl'
  ];

  const mockAddrs: Address[] = [ {
    id: 0,
    line1: '123 Fake St',
    line2: '#1',
    city: 'Anywhere',
    state: 'VA',
    zipcode: '12345'
  } ];
  const mockUser: User = {
    id: '00000000-0000-0000-0000-000000000000',
    firstName: 'Foo',
    lastName: 'Testuser',
    email: 'foo@example.com',
    addresses: mockAddrs,
    loyaltyPoints: 1,
    addrLine1: '',
    addrLine2: '',
    city: '',
    state: '',
    zipcode: '',
    ticketEmails: true,
    flightEmails: true
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
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
    component.userProfileForm.get('zipCodeControl')!.setValue('0');
    component.userProfileForm.get('zipCodeControl')!.markAsTouched();

    expect(component.userProfileForm.get('zipCodeControl')!.invalid).toBeTrue();
  });

  it('form email field should be invalid if bad email entered', () => {
    component.userProfileForm.get('emailControl')!.setValue('Not an email!');
    component.userProfileForm.get('emailControl')!.markAsTouched();

    expect(component.userProfileForm.get('emailControl')!.invalid).toBeTrue();
  });
});

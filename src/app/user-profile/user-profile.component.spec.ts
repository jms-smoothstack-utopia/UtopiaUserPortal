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

  const mockAddrs: Address[] = [ {
    id: 0,
    line1: '123 Fake St',
    line2: '#1',
    city: 'Anywhere',
    state: 'VA',
    zipcode: '12345'
  } ];
  const mockUser: User = {
    id: 1,
    firstName: 'Foo',
    lastName: 'Testuser',
    email: 'foo@example.com',
    addresses: mockAddrs,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkIsValidUser true on valid user', () => {
    expect(component.checkIsValidUser(mockUser)).toBeTrue();
  });

  it('checkUser should set the user', () => {
    component.setUser(mockUser);
    expect((component.user as User).firstName).toEqual('Foo');
  });

  it('fillThisUserAddr should fill in user address', () => {
    component.setUser(mockUser);
    //address should have been filled as part of setUser
    expect((component.user as User).addrLine1).toEqual('123 Fake St');
  });
});

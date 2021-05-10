import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentmethodListComponent } from './user-paymentmethod-list.component';

describe('UserPaymentmethodListComponent', () => {
  let component: UserPaymentmethodListComponent;
  let fixture: ComponentFixture<UserPaymentmethodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPaymentmethodListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentmethodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

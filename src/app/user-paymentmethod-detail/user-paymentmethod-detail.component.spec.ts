import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentmethodDetailComponent } from './user-paymentmethod-detail.component';

describe('UserPaymentmethodDetailComponent', () => {
  let component: UserPaymentmethodDetailComponent;
  let fixture: ComponentFixture<UserPaymentmethodDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPaymentmethodDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentmethodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

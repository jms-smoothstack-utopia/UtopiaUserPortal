import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentmethodRemoveComponent } from './user-paymentmethod-remove.component';

describe('UserPaymentmethodRemoveComponent', () => {
  let component: UserPaymentmethodRemoveComponent;
  let fixture: ComponentFixture<UserPaymentmethodRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPaymentmethodRemoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentmethodRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentmethodAddComponent } from './user-paymentmethod-add.component';

describe('UserPaymentmethodAddComponent', () => {
  let component: UserPaymentmethodAddComponent;
  let fixture: ComponentFixture<UserPaymentmethodAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPaymentmethodAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentmethodAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

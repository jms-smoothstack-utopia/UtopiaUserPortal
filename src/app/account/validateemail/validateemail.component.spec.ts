import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateemailComponent } from './validateemail.component';

describe('ValidateemailComponent', () => {
  let component: ValidateemailComponent;
  let fixture: ComponentFixture<ValidateemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

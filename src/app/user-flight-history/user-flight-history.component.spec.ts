import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightHistoryComponent } from './user-flight-history.component';

describe('UserFlightHistoryComponent', () => {
  let component: UserFlightHistoryComponent;
  let fixture: ComponentFixture<UserFlightHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFlightHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

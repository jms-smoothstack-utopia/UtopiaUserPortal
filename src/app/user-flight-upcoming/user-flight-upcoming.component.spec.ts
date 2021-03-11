import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightUpcomingComponent } from './user-flight-upcoming.component';

describe('UserFlightUpcomingComponent', () => {
  let component: UserFlightUpcomingComponent;
  let fixture: ComponentFixture<UserFlightUpcomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFlightUpcomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightUpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

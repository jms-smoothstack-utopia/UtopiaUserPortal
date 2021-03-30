import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightListComponent } from './user-flight-list.component';

describe('UserFlightListComponent', () => {
  let component: UserFlightListComponent;
  let fixture: ComponentFixture<UserFlightListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFlightListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

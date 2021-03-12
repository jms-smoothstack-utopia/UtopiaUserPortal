import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightHistoryComponent } from './user-flight-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { Ticket } from '../ticket';

describe('UserFlightHistoryComponent', () => {
  let component: UserFlightHistoryComponent;
  let fixture: ComponentFixture<UserFlightHistoryComponent>;
  let flightRecordsServiceSpy: FlightRecordsService;

  //mock ticket: most fields filled in, but need to test the pretty print
  //multiple mock tickets to test if it fills the tickets array
  //no form to create, but maybe see if the table generation can be tested

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

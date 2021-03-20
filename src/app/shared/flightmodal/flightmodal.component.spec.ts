import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FlightmodalComponent } from './flightmodal.component';

describe('FlightmodalComponent', () => {
  let component: FlightmodalComponent;
  let fixture: ComponentFixture<FlightmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightmodalComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

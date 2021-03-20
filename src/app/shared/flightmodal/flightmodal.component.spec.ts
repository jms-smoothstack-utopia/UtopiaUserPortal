import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightmodalComponent } from './flightmodal.component';

describe('FlightmodalComponent', () => {
  let component: FlightmodalComponent;
  let fixture: ComponentFixture<FlightmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightmodalComponent ]
    })
    .compileComponents();
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

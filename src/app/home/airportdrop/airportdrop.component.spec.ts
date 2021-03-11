import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportdropComponent } from './airportdrop.component';

describe('AirportdropComponent', () => {
  let component: AirportdropComponent;
  let fixture: ComponentFixture<AirportdropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirportdropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportdropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FlightRecordsService } from './flight-records.service';

describe('FlightRecordsService', () => {
  let service: FlightRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

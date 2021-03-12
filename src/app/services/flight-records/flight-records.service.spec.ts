import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FlightRecordsService } from './flight-records.service';

describe('FlightRecordsService', () => {
  let service: FlightRecordsService;
  let httpTestingController: HttpTestingController;
  let mockId = '00000000-0000-0000-0000-000000000000';

  //test whether it sends requests

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(FlightRecordsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

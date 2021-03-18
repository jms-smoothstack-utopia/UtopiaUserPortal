import { TestBed } from '@angular/core/testing';
import { FlightsearchService } from './flightsearch.service';
import { HttpClientTestingModule, HttpTestingController,} from '@angular/common/http/testing';

describe('FlightsearchService', () => {
  let service: FlightsearchService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FlightsearchService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should GET with minimum data", () => {
    const fakeParams = "origin=D.C&destinations=LA&departure=2021-05-17";
    const mockResponse = {Origintodestination: any[]}

    service.getFlights(fakeParms).subscribe((res:any) => {
      expect(res).toEqual(mockResponse);
    })
  })

});

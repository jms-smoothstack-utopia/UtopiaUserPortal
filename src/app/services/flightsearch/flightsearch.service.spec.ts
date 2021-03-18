import { TestBed } from '@angular/core/testing';
import { FlightsearchService } from './flightsearch.service';
import { HttpClientTestingModule, HttpTestingController,} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('FlightsearchService', () => {
  let service: FlightsearchService;
  let httpTestingController: HttpTestingController;
  const flightURL = environment.flightsEndpoint;
  const servicingAreaURL = environment.servicingAreaEndpoint;

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

  it("should GET with minimum data for flight search", () => {

    const fakeParams = "origin=D.C&destinations=LA&departure=2021-05-17";
    let mockResponse:any = {
      Origintodestination: [],
    } 

    service.getFlights(fakeParams).subscribe((res:any) => {
      expect(res).toEqual(mockResponse);
    })

    const req = httpTestingController.expectOne(flightURL + "/flight-search?" + fakeParams)
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  })

  it("should GET with minimum data for servicing area search", () => {

    let mockResponse:any = [];

    service.getServicingArea().subscribe((res:any) => {
      expect(res).toEqual(mockResponse);
    })

    const req = httpTestingController.expectOne(servicingAreaURL);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  })

});

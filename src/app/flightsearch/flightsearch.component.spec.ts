import { ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, Subscription } from 'rxjs';
import { FlightsearchComponent } from './flightsearch.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SortMethod, TripType, StopType, flight } from '../shared/methods/flightsearchObjects';
import { environment } from 'src/environments/environment';

let fakeData = [
  [
    {
      origin: 
      {
        iataId: "IAD",
        name: "Dulles International Airport",
        servicingArea: 
        {
          servicingArea: "D.C"
        }
      },
      destination: 
      {
        iataId: "LAX",
        name: "Los Angles International Airport",
        servicingArea: 
        {
          servicingArea: "LA"
        }
      },
      creationDateTime: "2021-03-17T17:30:56.760945-04:00",
      approximateDateTimeStart : "2021-05-17T08:10:00-04:00",
      approximateDateTimeEnd: "2021-05-17T12:00:00-04:00",
      possibleLoyaltyPoints: 12,
      seats: [{price:100.00, seatClass: "ECONOMY", seatStatus:"AVAILABLE"}, {price:100.00, seatClass: "BUSINESS", seatStatus:"AVAILABLE"}],
      airplane: 
      {
        name: "Boeing 747",
      }
    }
  ],
  [
    {
      origin: 
      {
        iataId: "DCA",
        name: "Dulles International Airport",
        servicingArea: 
        {
          servicingArea: "D.C"
        }
      },
      destination: 
      {
        iataId: "LAX",
        name: "Los Angles International Airport",
        servicingArea: 
        {
          servicingArea: "LA"
        }
      },
      creationDateTime: "2021-03-15T17:30:56.760945-04:00",
      approximateDateTimeStart : "2021-05-17T08:10:00-04:00",
      approximateDateTimeEnd: "2021-05-17T12:00:00-04:00",
      possibleLoyaltyPoints: 12,
      seats: [{price:100.00, seatClass: "ECONOMY", seatStatus:"AVAILABLE"}, {price:100.00, seatClass: "BUSINESS", seatStatus:"AVAILABLE"}],
      airplane: 
      {
        name: "Boeing 737",
      }
    }
  ],
  [
    {
      origin: 
      {
        iataId: "DCA",
        name: "Dulles International Airport",
        servicingArea: 
        {
          servicingArea: "D.C"
        }
      },
      destination: 
      {
        iataId: "JFK",
        name: "Los Angles International Airport",
        servicingArea: 
        {
          servicingArea: "LA"
        }
      },
      creationDateTime: "2021-03-16T17:30:56.760945-04:00",
      approximateDateTimeStart : "2021-05-17T08:10:00-04:00",
      approximateDateTimeEnd: "2021-05-17T12:00:00-04:00",
      possibleLoyaltyPoints: 12,
      seats: [{price:100.00, seatClass: "ECONOMY", seatStatus:"AVAILABLE"}, {price:100.00, seatClass: "BUSINESS", seatStatus:"AVAILABLE"}],
      airplane: 
      {
        name: "Boeing 747",
      }
    },
    {
      origin: 
      {
        iataId: "JFK",
        name: "Dulles International Airport",
        servicingArea: 
        {
          servicingArea: "NYC"
        }
      },
      destination: 
      {
        iataId: "LAX",
        name: "Los Angles International Airport",
        servicingArea: 
        {
          servicingArea: "LA"
        }
      },
      creationDateTime: "2021-03-16T17:30:56.760945-04:00",
      approximateDateTimeStart : "2021-05-17T14:10:00-04:00",
      approximateDateTimeEnd: "2021-05-17T16:00:00-04:00",
      possibleLoyaltyPoints: 12,
      seats: [{price:100.00, seatClass: "ECONOMY", seatStatus:"AVAILABLE"}, {price:100.00, seatClass: "BUSINESS", seatStatus:"AVAILABLE"}],
      airplane: 
      {
        name: "Boeing 747",
      }
    }
  ],
]

const data = {  
  origin: "D.C",
  destinations: "LAX",
  departure: "2030-05-17",
  return: "2030-05-28",
  adults: 3,
  children: 1,
  multiHop: "true",
  }

describe('FlightsearchComponent', () => {
  let component: FlightsearchComponent;
  let fixture: ComponentFixture<FlightsearchComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        FlightsearchComponent, 
      ],
      imports:[ 
        RouterTestingModule,
        HttpClientTestingModule 
      ],
      providers: 
      [],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    (data)
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should do two GET requests: one for flights, and one for servicing area //flights error", () => {

    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    (data)
    fixture.detectChanges();

    const baseURL = environment.flightsEndpoint + "/flight-search?origin=D.C&" +
    "destinations=LAX&departure=2030-05-17&return=2030-05-28&passengercount=4&multihop=true"
    const servicingAreaURL = environment.servicingAreaEndpoint;

    //Create the mock item for the httpMock
    const flightReq = httpMock.expectOne(baseURL);
    const servicingAreaReq = httpMock.expectOne(servicingAreaURL);

    flightReq.flush([], {status:503, statusText:"Service unavailable"})
    expect(flightReq.request.method).toBe("GET");
    expect(component.noResultsErrorMsg).toEqual("There was a problem. Please try again")
    expect(component.viewData).toEqual([]);
  })

  it("should do two GET requests: one for flights, and one for servicing area //servicing area error", () => {

    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    (data)
    fixture.detectChanges();

    const baseURL = environment.flightsEndpoint + "/flight-search?origin=D.C&" +
    "destinations=LAX&departure=2030-05-17&return=2030-05-28&passengercount=4&multihop=true"
    const servicingAreaURL = environment.servicingAreaEndpoint;

    //Create the mock item for the httpMock
    const flightReq = httpMock.expectOne(baseURL);
    const servicingAreaReq = httpMock.expectOne(servicingAreaURL);

    servicingAreaReq.flush([], {status:503, statusText:"Service unavailable"})
    expect(servicingAreaReq.request.method).toBe("GET");
    expect(component.noResultsErrorMsg).toEqual("There was a problem. Please try again")
    expect(component.viewData).toEqual([]);
  })

  it("should present error if minimum requirements are not filled", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({origin:null, destinations: null, departure: null})
    fixture.detectChanges();

    expect(component.viewData).toEqual([]);
    expect(component.flightsData).toEqual([]);
    expect(component.noResultsErrorMsg).toEqual("Please include an origin, destination, and atleast a date when you want to fly")
  })

  it("Going through ternary operators for from airport, null", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({origin:null})
    fixture.detectChanges();

    expect(component.fromAirport).toEqual("");
  })

  it("Going through ternary operators for from airport, included", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({origin:"D.C"})
    fixture.detectChanges();

    expect(component.fromAirport).toEqual("D.C");
  })

  it("Going through ternary operators for to airport, null", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({destinations:null})
    fixture.detectChanges();

    expect(component.toAirport).toEqual("");
  })

  it("Going through ternary operators for to airport, included", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({destinations:"LA"})
    fixture.detectChanges();

    expect(component.toAirport).toEqual("LA");
  })

  it("Going through ternary operators for from calendar, null", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({departure:null})
    fixture.detectChanges();

    expect(component.fromCalendar).toEqual("");
    expect(component.fromModel).toEqual(undefined);
  })

  it("Going through ternary operators for from calendar, badinput", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({departure:"bad-input"})
    fixture.detectChanges();

    expect(component.viewData).toEqual([]);
    expect(component.noResultsErrorMsg).toEqual("Input Error");
  })

  it("Going through ternary operators for from calendar, included", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({departure:"2021-10-12"})
    fixture.detectChanges();
    
    //Added tempObject
    let tempObject = {
      year: 2021,
      month: 10,
      day: 12
    }

    expect(component.fromCalendar).toEqual("2021-10-12");
    expect(component.fromModel).toEqual(tempObject);
  })

  it("Going through ternary operators for to calendar, null", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({return:null})
    fixture.detectChanges();

    expect(component.disableToCalendar).toEqual(true);
    expect(component.tripRB).toEqual("One-Way");
    expect(component.toCalendar).toEqual("");
    expect(component.toModel).toEqual(undefined);
  })

  it("Going through ternary operators for to calendar, badinput", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({return:"bad-input"})
    fixture.detectChanges();
    //hello
    expect(component.viewData).toEqual([]);
    expect(component.noResultsErrorMsg).toEqual("Input Error");
  })

  it("Going through ternary operators for to calendar, included", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({return:"2021-10-12"})
    fixture.detectChanges();
    
    //Added tempObject
    let tempObject = {
      year: 2021,
      month: 10,
      day: 12
    }

    expect(component.disableToCalendar).toEqual(false);
    expect(component.tripRB).toEqual("Round-Trip");
    expect(component.toCalendar).toEqual("2021-10-12");
    expect(component.toModel).toEqual(tempObject);
  })

  it("Going through ternary operators for adults, null", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({adults:null})
    fixture.detectChanges();

    expect(component.adult).toEqual(1);
  })

  it("Going through ternary operators for adults, included", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({adults:2})
    fixture.detectChanges();
  
    expect(component.adult).toEqual(2);
  })

  it("Going through ternary operators for children, null", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({children:null})
    fixture.detectChanges();

    expect(component.countOfChildren).toEqual(0);
  })

  it("Going through ternary operators for children, included", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({children:2})
    fixture.detectChanges();
  
    expect(component.countOfChildren).toEqual(2);
  })

  it("Going through ternary operators for multihop, null", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({multiHop:null})
    fixture.detectChanges();

    expect(component.nonStopRB).toEqual("Non-Stop");
  })

  it("Going through ternary operators for multihop, included", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    ({multiHop: "true"})
    fixture.detectChanges();
  
    expect(component.nonStopRB).toEqual("Multihop");
  })

  it("processGetResults but no origin to destination flights available", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    (data)
    fixture.detectChanges();

    let fakeRes = {"Origin to destination": [], "Destination to origin": []}
    component.processGetResults(fakeRes);
    
    expect(component.flightsData).toEqual([]);
    expect(component.viewData).toEqual([]);
    expect(component.noResultsErrorMsg).toEqual("We could not find any flights with your search results. Please try again with different parameters")
  })

  it("processGetResults but no standardize results", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    (data)
    fixture.detectChanges();

    const spy = spyOn(component, "standardizeResults");
    spy.and.returnValue([]);

    let fakeRes = {"Origin to destination": [1,2,3,4,5], "Destination to origin": []}
    component.processGetResults(fakeRes);
    
    expect(spy).toHaveBeenCalled();
    expect(component.flightsData).toEqual([]);
    expect(component.viewData).toEqual([]);
    expect(component.noResultsErrorMsg).toEqual("We could not find any flights with your search results. Please try again with different parameters")
  })

  it("processGetResults but standardize results but destination to origin exists", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of
    (data)
    fixture.detectChanges();

    let processedInfo = component.standardizeResults(fakeData);
    processedInfo = processedInfo.sort((a,b) => b.basePrice.replace(/[$,]+/g,"") - a.basePrice.replace(/[$,]+/g,""));

    const spy = spyOn(component, "standardizeResults");
    spy.and.returnValue(processedInfo);

    let fakeRes = {"Origin to destination": [1,2,3,4,5], "Destination to origin": [1,2,3,4,5]}
    component.processGetResults(fakeRes);
    
    expect(spy).toHaveBeenCalled();
    expect(component.flightsData).toEqual(processedInfo);
    expect(component.viewData).toEqual(processedInfo);
  })

  it("standardizeResults, nonstop", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
    })
    fixture.detectChanges();

    let standardizedData = component.standardizeResults(fakeData);
    expect(standardizedData.length).toEqual(2);
  })

  it("standardizeResults, multihop", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })
    fixture.detectChanges();

    let standardizedData = component.standardizeResults(fakeData);
    expect(standardizedData.length).toEqual(3);
  })

  it("initializePeopleString", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
    })
    fixture.detectChanges();

    component.initializePeopleString();
    expect(component.numberOfPeople).toEqual("1 Adult");
  })

  it("initializePeopleString", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
    })
    fixture.detectChanges();

    component.initializePeopleString();
    expect(component.numberOfPeople).toEqual("1 Adult; 1 Children");
  })

  it("sort expensive", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sort = "expensive";
    component.sortData()

    expect(component.viewData[0]["basePrice"]).toEqual("$200.00");
    expect(component.viewData[1]["basePrice"]).toEqual("$100.00");
  })

  it("sort cheapest", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    component.sort = "cheapest";
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sortData()

    expect(component.viewData[0]["basePrice"]).toEqual("$100.00");
    expect(component.viewData[1]["basePrice"]).toEqual("$100.00");
    expect(component.viewData[2]["basePrice"]).toEqual("$200.00");
  })

  it("sort most recent", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    component.sort = "most recent";
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sortData()

    expect(component.viewData[0].creationTime).toEqual("2021-03-17T17:30:56.760945-04:00");
  })

  it("sort oldest", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    component.sort = "oldest";
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sortData()

    expect(component.viewData[0].creationTime).toEqual("2021-03-15T17:30:56.760945-04:00");
  })

  it("low number of hops", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    component.sort = "Low number of hops";
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sortData()

    expect(component.viewData[0].numberOfHops).toEqual(1);
  })

  it("high number of hops", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    component.sort = "High number of hops";
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sortData()

    expect(component.viewData[0].numberOfHops).toEqual(2);
  })

  it("shortest duration", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    component.sort = "Shortest duration";
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sortData()
    expect(component.viewData[0].durationInMilliseconds).toEqual(13800000);
  })
  
  it("longest duration", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    component.sort = "Longest duration";
    fixture.detectChanges();

    component.viewData = component.standardizeResults(fakeData);
    expect(component.viewData.length).toEqual(3);

    component.sortData()
    expect(component.viewData[0].durationInMilliseconds).toEqual(20400000);
  })

  it("change pagination", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })

    fixture.detectChanges();

    let event = {target: {value: 20}}
    component.changePagination(event);

    expect(component.paginationCount).toEqual(20);
  })

  it("toggle ticket test", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })
    component.viewData = component.standardizeResults(fakeData);
    fixture.detectChanges();

    let mouseEvent = new MouseEvent("click");
    component.toggleTicket(0, mouseEvent);

    let specificHTMLElement = document.getElementById("0") as HTMLElement;
    expect(specificHTMLElement.style.display).toEqual("initial");
  })

  it("closing toggle ticket test", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })
    component.viewData = component.standardizeResults(fakeData);
    fixture.detectChanges();

    let mouseEvent = new MouseEvent("click");
    component.toggleTicket(0, mouseEvent);

    const specificHTMLElement = document.getElementById("0") as HTMLElement;
    expect(specificHTMLElement.style.display).toEqual("initial");

    component.toggleTicket(1, mouseEvent);
    const updatedHTMLElement = document.getElementById("0") as HTMLElement;
    expect(updatedHTMLElement.style.display).toEqual("none");
    const newlyOpenedHTMLElement = document.getElementById("1") as HTMLElement;
    expect(newlyOpenedHTMLElement.style.display).toEqual("initial");
  })

  it("test eventSort", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })
    component.viewData = component.standardizeResults(fakeData);
    fixture.detectChanges();
    component.eventSort("cheapest", "PriceLowToHigh");

    let specificElement = document.getElementById("PriceLowToHigh") as HTMLElement;
    expect(specificElement.classList).toContain("selected");
  })

  it("test reclicking on same sort eventSort", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })
    component.viewData = component.standardizeResults(fakeData);
    fixture.detectChanges();
    component.eventSort("cheapest", "PriceLowToHigh");

    let specificElement = document.getElementById("PriceLowToHigh") as HTMLElement;
    expect(specificElement.classList).toContain("selected");

    component.eventSort("cheapest", "PriceLowToHigh");
    let updatedElement = document.getElementById("PriceLowToHigh") as HTMLElement;
    expect(updatedElement.classList).not.toContain("selected");
  })

  it("click on another sort eventSort", () => {
    fixture = TestBed.createComponent(FlightsearchComponent);
    component = fixture.componentInstance;
    TestBed.inject(ActivatedRoute).queryParams = of({  
      origin: "D.C",
      destinations: "LAX",
      departure: "2030-05-17",
      adults: 1,
      children: 1,
      multiHop: "true",
    })
    component.viewData = component.standardizeResults(fakeData);
    fixture.detectChanges();
    component.eventSort("cheapest", "PriceLowToHigh");

    let specificElement = document.getElementById("PriceLowToHigh") as HTMLElement;
    expect(specificElement.classList).toContain("selected");

    component.eventSort("Longest duration", "DurationLongToShort");
    let updatedElement = document.getElementById("PriceLowToHigh") as HTMLElement;
    expect(updatedElement.classList).not.toContain("selected");
  })
});
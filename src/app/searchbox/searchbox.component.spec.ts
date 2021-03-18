import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchboxComponent } from './searchbox.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

let router = {
  navigate: jasmine.createSpy('navigate')
}

describe('SearchboxComponent', () => {
  let component: SearchboxComponent;
  let fixture: ComponentFixture<SearchboxComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchboxComponent ],
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule,
        NgbModule
      ],
      providers:[
        {provide: Router, useValue: router}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchboxComponent);
    component = fixture.componentInstance;
    component.overlay = "";
    component.tripRB = "One-Way";
    component.adult = 1;
    component.countOfChildren = 0;
    component.numberOfPeople = "1 Adult";
    component.fromAirport = "";
    component.toAirport = "";
    component.fromModel = undefined;
    component.toModel = undefined;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('click on TripRB button, then tripRBOverlay should display', () => {

    //const event
    const event = new MouseEvent('click');

    //Spy on the function
    spyOn(component, "toggleOverlay");

    //Press the button
    let overlayButton = fixture.debugElement.nativeElement.querySelector("#tripRBId");
    overlayButton.click();

    //Expect toggerOverlay has been called
    expect(component.toggleOverlay).toHaveBeenCalledOnceWith('tripRBOverlay', event);
  })

  it('click on nonStopRB button, then nonStopRBOverlay should display', () => {

    //const event
    const event = new MouseEvent('click');

    //Spy on the function
    spyOn(component, "toggleOverlay");

    //Press the button
    let overlayButton = fixture.debugElement.nativeElement.querySelector("#nonStopRBId");
    overlayButton.click();

    //Expect toggerOverlay has been called
    expect(component.toggleOverlay).toHaveBeenCalledOnceWith('nonStopOverlay', event);
  })

  it('click on numberOfPeople button, then numberOfPeople dropdown should display', () => {

    //const event
    const event = new MouseEvent('click');

    //Spy on the function
    spyOn(component, "toggleOverlay");

    //Press the button
    let overlayButton = fixture.debugElement.nativeElement.querySelector("#numberOfPeopleId");
    overlayButton.click();

    //Expect toggerOverlay has been called
    expect(component.toggleOverlay).toHaveBeenCalledOnceWith('numberOverlay', event);
  })

  it("should display popup when correct parameters are passed in to function toggleOverlay(x, y)", () => {

    const event = new MouseEvent('click');
    //Test with parameter tripRBOverlay
    component.toggleOverlay("tripRBOverlay", event);
    expect(component.overlay).toBe("tripRBOverlay");

    const HTMLElement = fixture.debugElement.nativeElement.querySelector("#tripRBOverlay");
    expect(HTMLElement.style.display).toBe("initial");

    //Now I need to test whether or not the display closes if same function is called on another overlay
    component.toggleOverlay("nonStopOverlay", event);

    const newHTMLElement = fixture.debugElement.nativeElement.querySelector("#nonStopOverlay");
    expect(component.overlay).toBe("nonStopOverlay");
    expect(HTMLElement.style.display).toBe("none");
    expect(newHTMLElement.style.display).toBe("initial");
  });

  it("should change innerHTML and user choices when correct parameters are passed in to afterChoosingAnOption", () => {
    
    //Should just be "One-Way"
    component.tripRB = "One-Way"

    const initialMessage = fixture.debugElement.nativeElement.querySelector("#tripRBId").innerHTML;
    component.afterChoosingAnOption("tripRBOverlay", "Round-Trip", "tripRB");
    expect(component.tripRB).toBe("Round-Trip");

    fixture.detectChanges();

    const nextMessage = fixture.debugElement.nativeElement.querySelector("#tripRBId").innerHTML;
    expect(initialMessage).not.toEqual(nextMessage);

    //Seeing if it closes the overlay
    const overlay = fixture.debugElement.nativeElement.querySelector("#tripRBOverlay");
    expect(overlay.style.display).toEqual("none");
  });

  it("should show calendar if tripRB is return-trip", () => {
    
    //Should just be "One-Way"
    component.tripRB = "One-Way"

    component.afterChoosingAnOption("tripRBOverlay", "Round-Trip", "tripRB");
    expect(component.tripRB).toBe("Round-Trip");

    fixture.detectChanges();

    expect(component.disableToCalendar).toEqual(false);
    expect(component.placeHolder).toEqual("To: yyyy-mm-dd");
  });

  it("should hide calendar if tripRB is one-way (went from roundtrip to one-way)", () => {
    
    //Should just be "One-Way"
    component.tripRB = "Round-Trip"

    component.afterChoosingAnOption("tripRBOverlay", "One-Way", "tripRB");
    expect(component.tripRB).toBe("One-Way");

    fixture.detectChanges();

    expect(component.disableToCalendar).toEqual(true);

    //Does not actually show to user because we hide the calendar
    expect(component.placeHolder).toEqual("No return date needed");

    //Make sure delete
    expect(component.toModel).toBe(undefined);
  });

  it("should change innerHTML if more adults and children are included", ()=> {

    //Need to replicate the event.target.format
    const event = {target:{value: 2}};
    const nextEvent = {target:{value: 1}};
    const initialMessage = fixture.debugElement.nativeElement.querySelector("#numberOfPeopleId").innerHTML;

    //Test Adults
    component.updateNumberOfPerson("Adult", event);
    expect(component.adult).toEqual(2);
    expect(component.numberOfPeople).toEqual("2 Adults");

    //Test Children
    component.updateNumberOfPerson("Children", nextEvent);
    expect(component.countOfChildren).toEqual(1);
    expect(component.numberOfPeople).toEqual("2 Adults; 1 Children")

    fixture.detectChanges();
    const nextMessage = fixture.debugElement.nativeElement.querySelector("#numberOfPeopleId").innerHTML;
    expect(initialMessage).not.toEqual(nextMessage);
  })

  it("testing setInput in the from airplanes", () => {
    const event = {target:{value: "D.C"}}
    component.setInput(event, "from");
    expect(component.fromAirport).toBe("D.C");
  })

  it("testing setInput in the to airplanes", () => {
    const event = {target:{value: "LAX"}}
    component.setInput(event, "to");
    expect(component.toAirport).toBe("LAX");
  })

  it("close specified overlay", () => {

    component.overlay = "";

    const event = new MouseEvent("click");
    component.toggleOverlay("nonStopOverlay", event);
    fixture.detectChanges();

    //Check if it is first open

    const HTMLElement = fixture.debugElement.nativeElement.querySelector("#nonStopOverlay");
    expect(HTMLElement.style.display).toBe("initial");
    expect(component.overlay).toBe("nonStopOverlay");

    //Now let's test closing

    component.closeOverlay("nonStopOverlay");
    fixture.detectChanges();

    const newHTMLElement = fixture.debugElement.nativeElement.querySelector("#nonStopOverlay");
    expect(component.overlay).toEqual("");
    expect(newHTMLElement.style.display).toBe("none");
  })

  it("should swap when swap button is clicked if both inputs have items", () => {
    component.fromAirport = "D.C";
    component.toAirport = "LAX";

    component.swapLocations();
    fixture.detectChanges();

    expect(component.toAirport).toBe("D.C");
    expect(component.fromAirport).toBe("LAX");
  })

  it("should swap when swap button is clicked if only one input has an item", () => {
    component.fromAirport = "D.C";
    component.toAirport = "";

    component.swapLocations();
    fixture.detectChanges();

    expect(component.toAirport).toBe("D.C");
    expect(component.fromAirport).toBe("");
  })

  it("should throw an error if we have included no adults or adults is 0", () => {

    component.adult = 0;
    //Begin the search
    component.search();

    expect(component.adultErrorMsg).toEqual("Atleast one adult needed");
  })

  it("should throw an error if we have included negative people(adult)", () => {

    component.adult = -1;
    //Begin the search
    component.search();
    expect(component.adultErrorMsg).toEqual("Negative people do not exist D:");
  })

  it("should throw an error if we have included negative people(adult)", () => {

    component.countOfChildren = -1;
    //Begin the search
    component.search();
    expect(component.adultErrorMsg).toEqual("Negative people do not exist D:");
  })

  it("should throw an error if there is no user input for from airport", () => {
    component.adult = 1;
    component.fromAirport = "";
    component.search();
    expect(component.fromAirportErrorMsg).toEqual("You need to include an airport to depart from!")
  })

  it("should throw an error if there is no user input for to airport", () => {
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "";
    component.search();
    expect(component.toAirportErrorMsg).toEqual("You need to include a destination")
  })

  it("should throw an error if from date is not included ", () => {
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = undefined;
    component.search();
    expect(component.calendarErrorMsg).toEqual("You need to include a date to fly!")
  })

  it("should throw an error if from date is not included ", () => {
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = {
      year: 2000,
      month: 5,
      day: 17,
    }
    component.search();
    expect(component.calendarErrorMsg).toEqual("Cannot include a date in the past!")
  })

  it("should throw an error if to date is not included and round trip is selected ", () => {
    component.tripRB = "Round-Trip"
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = {
      year: 2030,
      month: 5,
      day: 17,
    }
    component.search();
    expect(component.returnCalendarErrorMsg).toEqual("Need to include a return date");
  })

  it("should throw an error if to date is not included and round trip is selected ", () => {
    component.tripRB = "Round-Trip"
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = {
      year: 2030,
      month: 5,
      day: 17,
    }
    component.toModel = {
      year: 2000,
      month: 5,
      day: 17
    }
    component.search();
    expect(component.returnCalendarErrorMsg).toEqual("Return date must be after trip date");
  })

  it("should navigate to flight-search page if we have minimum parameters", () => {
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = {
      year: 2030,
      month: 5,
      day: 17,
    }

    let testParamsInit:any = {
      origin: component.fromAirport,
      destinations: component.toAirport,
      departure: component.fromModel.year + "-" + component.fromModel.month.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}) + "-" + component.fromModel.day.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}),
    }

    testParamsInit["adults"] = component.adult;

    component.search();
    expect(router.navigate).toHaveBeenCalledWith(['/flight-search'], {queryParams: testParamsInit});
  })

  it("should navigate to flight-search page if we have minimum parameters + children", () => {
    component.adult = 1;
    component.countOfChildren = 2;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = {
      year: 2030,
      month: 5,
      day: 17,
    }

    let testParamsInit:any = {
      origin: component.fromAirport,
      destinations: component.toAirport,
      departure: component.fromModel.year + "-" + component.fromModel.month.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}) + "-" + component.fromModel.day.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}),
    }

    testParamsInit["adults"] = component.adult;
    testParamsInit["children"] = component.countOfChildren;

    component.search();
    expect(router.navigate).toHaveBeenCalledWith(['/flight-search'], {queryParams: testParamsInit});
  })

  it("should navigate to flight-search page if we have minimum parameters + multihop", () => {
    component.nonStopRB = "Multihop";
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = {
      year: 2030,
      month: 5,
      day: 17,
    }
    let testParamsInit:any = {
      origin: component.fromAirport,
      destinations: component.toAirport,
      departure: component.fromModel.year + "-" + component.fromModel.month.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}) + "-" + component.fromModel.day.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}),
    }

    testParamsInit["adults"] = component.adult;
    testParamsInit["multiHop"] = true;

    component.search();
    expect(router.navigate).toHaveBeenCalledWith(['/flight-search'], {queryParams: testParamsInit});
  })

  it("should navigate to flight-search page if we have minimum parameters + returntrip", () => {
    component.tripRB = "Round-Trip";
    component.adult = 1;
    component.fromAirport = "D.C";
    component.toAirport = "LAX";
    component.fromModel = {
      year: 2030,
      month: 5,
      day: 17,
    }
    component.toModel = {
      year: 2030,
      month: 5,
      day: 28
    }

    let testParamsInit:any = {
      origin: component.fromAirport,
      destinations: component.toAirport,
      departure: component.fromModel.year + "-" + component.fromModel.month.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}) + "-" + component.fromModel.day.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}),
    }

    testParamsInit["return"] = component.toModel.year + "-" + component.toModel.month.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}) + "-" + component.toModel.day.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});
    testParamsInit["adults"] = component.adult;

    component.search();
    expect(router.navigate).toHaveBeenCalledWith(['/flight-search'], {queryParams: testParamsInit});
  })

  it("should return false if both parameters are undefined", () => {
    let date1 = undefined;
    let date2 = undefined

    let boolean = component.compareDates(date1, date2);

    expect(boolean).toBe(false);
  })

  it("should return false if date1 year is less than date2 year", () => {
    let date1 = {
      year: 1900,
      month: 1,
      day: 1
    };
    let date2 = {
      year: 2000,
      month:1,
      day:1
    }
    let boolean = component.compareDates(date1, date2);
    expect(boolean).toBe(false);
  })

  it("should return false if date1.year, date1.month == date2.year, date2.month, but date.1.day < date.2.day", () => {
    let date1 = {
      year: 2000,
      month: 1,
      day: 1
    };
    let date2 = {
      year: 2000,
      month:1,
      day:5
    }
    let boolean = component.compareDates(date1, date2);
    expect(boolean).toBe(false);
  })

  it("should return false date1.year == date2.year but date1.month < date2.month", () => {
    let date1 = {
      year: 2000,
      month: 3,
      day: 1
    };
    let date2 = {
      year: 2000,
      month:5,
      day:5
    }
    let boolean = component.compareDates(date1, date2);
    expect(boolean).toBe(false);
  })

  it("should return true date1.year > date2.year", () => {
    let date1 = {
      year: 2010,
      month: 3,
      day: 1
    };
    let date2 = {
      year: 2000,
      month:5,
      day:5
    }
    let boolean = component.compareDates(date1, date2);
    expect(boolean).toBe(true);
  })
});

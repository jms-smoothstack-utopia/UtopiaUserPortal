import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightsearchService } from 'src/app/services/flightsearch/flightsearch.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  flight,
  SortMethod,
  StopType,
  TripType,
} from '../shared/methods/flightsearchObjects';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-flightsearch',
  templateUrl: './flightsearch.component.html',
  styleUrls: ['./flightsearch.component.css'],
})
export class FlightsearchComponent implements OnInit {
  //Enum
  SortMethod = SortMethod;

  //Data from query params which we will pass in to the flight search component
  tripRB: string = TripType.ONE_WAY;
  nonStopRB: string = StopType.NON_STOP;
  adult: number = 1;
  countOfChildren: number = 0;
  numberOfPeople: string = '1 Adult';
  fromAirport: string = '';
  toAirport: string = '';
  fromCalendar: string = '';
  toCalendar: string = '';
  disableToCalendar = true;

  fromModel: NgbDateStruct | undefined;
  toModel: NgbDateStruct | undefined;

  //Just raw data, storing it just in case
  rawData: any = [];

  //Processed data list (only holds Origin to Destination)
  flightsData: flight[] = [];

  //Processed data list (only holds Destination to Origin)
  returnFlightsData: flight[] = [];
  returning: boolean = false;

  //The list we tie to the frontend
  viewData: flight[] = [];
  lookingAtReturnFlights: boolean = false;

  //Need to sort the data
  sort: string = SortMethod.EXPENSIVE;
  filter: string[] = [];

  //Holds cityData from backend
  cityData: string[] = [];

  //Holds generic pagination number
  paginationCount: number = 10;
  page: number = 1;

  //Errors if there is a problem with searching and/or no results from database
  //This is binded to some HTML element on the frontend
  noResultsErrorMsg: string = '';
  returnTripErrorMsg: string = '';

  //Show Modal When AddFlightToCart is pressed
  selectedFlight: flight = <flight>{};
  showModal: boolean = false;

  //Common error strings across the code
  couldNotFindAnyResults: string =
    'We could not find any flights with your search results. Please try again with different parameters.';
  pleaseProvideTheMinimumRequirements: string =
    'Please include an origin, destination, and atleast a date when you want to fly.';
  couldNotFindReturnTrips: string =
    'We could not find any flights that return from your destination. Do you still want to view your results?';
  inputError: string = 'Input Error!';
  problemExists: string = 'There was a problem. Please try again.';

  constructor(
    private activatedRoute: ActivatedRoute,
    private flightSearch: FlightsearchService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      let tempFromAirport = params['origin'];
      let tempToAirport = params['destinations'];
      let tempCalendarFrom = params['departure'];
      let tempCalendarTo = params['return'];
      let tempAdults = params['adults'];
      let tempChildren = params['children'];
      let tempNonStopRB = params['multiHop'];

      this.fromAirport = tempFromAirport == null ? '' : tempFromAirport;
      this.toAirport = tempToAirport == null ? '' : tempToAirport;
      this.fromCalendar = tempCalendarFrom == null ? '' : tempCalendarFrom;

      if (this.fromCalendar != '') {
        let val = this.parseCalendarString(this.fromCalendar);
        if (val != undefined) {
          this.fromModel = val;
        }
      }

      this.toCalendar = tempCalendarTo == null ? '' : tempCalendarTo;

      if (this.toCalendar != '') {
        let val = this.parseCalendarString(this.toCalendar);
        if (val != undefined) {
          this.toModel = val;
        }
      }

      this.tripRB =
        this.toCalendar == '' ? TripType.ONE_WAY : TripType.ROUND_TRIP;
      this.disableToCalendar = this.toCalendar == '';
      this.adult = tempAdults == null ? 1 : parseInt(tempAdults);
      this.countOfChildren = tempChildren == null ? 0 : parseInt(tempChildren);
      this.nonStopRB =
        tempNonStopRB == 'true' ? StopType.MULTIHOP : StopType.NON_STOP;
      this.initializePeopleString();

      //These three parameters cannot be empty; they are mandatory
      //Received from URL parameters
      if (
        this.fromAirport == '' ||
        this.toAirport == '' ||
        this.fromCalendar == ''
      ) {
        if (this.noResultsErrorMsg == '') {
          this.noValidData(this.pleaseProvideTheMinimumRequirements, undefined);
        }
      } else {
        //Now, we need to do the post request to get the flights data

        let baseSearchURL = '';

        //Add origin
        baseSearchURL += 'origin=' + this.fromAirport + '&';

        //Add destination
        baseSearchURL += 'destinations=' + this.toAirport + '&';

        //Add departure
        baseSearchURL += 'departure=' + this.fromCalendar;

        if (this.toCalendar != '') {
          baseSearchURL += '&return=' + this.toCalendar;
        }

        let passengerCount = this.adult + this.countOfChildren;
        if (passengerCount > 1) {
          baseSearchURL += '&passengercount=' + passengerCount;
        }

        if (this.nonStopRB == 'Multihop') {
          baseSearchURL += '&multihop=' + true;
        }

        this.flightSearch.getFlights(baseSearchURL).subscribe(
          (res) => {
            this.rawData = res;
            this.processGetResults(res);
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.noValidData(this.problemExists, undefined);
            return;
          }
        );
        //Do  the search for the servicing areas
        this.flightSearch.getServicingArea().subscribe(
          (res) => {
            res.forEach((element) => {
              if (!this.cityData.includes(element.areaName)) {
                this.cityData.push(element.areaName);
              }
            });
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.noValidData(this.problemExists, undefined);
          }
        );
      }
    });
  }

  parseCalendarString(dateString: string) {
    let tempVal: string[] = dateString.split('-');
    if (tempVal.length != 3) {
      this.noValidData(this.inputError, undefined);
      return;
    } else {
      return {
        year: parseInt(tempVal[0]),
        month: parseInt(tempVal[1]),
        day: parseInt(tempVal[2]),
      };
    }
  }

  noValidData(
    errorMsg: string | undefined,
    returnTripErrorMsg: string | undefined
  ): void {
    if (errorMsg != undefined) {
      this.flightsData = [];
      this.viewData = [];
      this.noResultsErrorMsg = errorMsg;
    }
    if (returnTripErrorMsg != undefined) {
      this.returnTripErrorMsg = returnTripErrorMsg;
    }
  }

  processGetResults(res: any) {
    let originToDestination = res['Origin to destination'];

    if (originToDestination.length == 0) {
      this.noValidData(this.couldNotFindAnyResults, undefined);
      return;
    } else {
      let processedData = this.standardizeResults(originToDestination);
      if (processedData.length == 0) {
        this.noValidData(this.couldNotFindAnyResults, undefined);
        return;
      } else {
        this.flightsData = processedData;
        this.viewData = [...this.flightsData];
        this.sortData();
      }
    }
    //So round trip flights
    if (this.tripRB == TripType.ROUND_TRIP) {
      let destinationToOrigin = res['Destination to origin'];
      if (destinationToOrigin.length == 0) {
        this.returnFlightsData = [];
        this.noValidData(undefined, this.couldNotFindReturnTrips);
        return;
      } else {
        let processedData = this.standardizeResults(destinationToOrigin);
        if (processedData.length == 0) {
          this.returnFlightsData = [];
          this.noValidData(undefined, this.couldNotFindReturnTrips);
          return;
        } else {
          //Do not make it viewdata; just need to store it for when user chooses initial flight
          this.returnFlightsData = processedData;
          this.returning = true;
        }
      }
    }
  }

  standardizeResults(data: Array<any>): Array<any> {
    //Create number formatter
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    let getCorrectFlights: flight[] = [];

    data.forEach((element: any) => {
      //Shared information between nonstop and multihop
      let newFlight = <flight>{};
      newFlight.airplane = element[0].airplane;
      newFlight.business = element[0].seats.filter(
        (x: any) => x.seatClass == 'BUSINESS' && x.seatStatus == 'AVAILABLE'
      ).length;
      newFlight.creationTime = element[0].creationDateTime;
      newFlight.destination = element[element.length - 1].destination;
      newFlight.economy = element[0].seats.filter(
        (x: any) => x.seatClass == 'ECONOMY' && x.seatStatus == 'AVAILABLE'
      ).length;
      newFlight.fromDateTime = element[0].approximateDateTimeStart;
      newFlight.multihop = element.length != 1;
      newFlight.numberOfHops = element.length;
      newFlight.origin = element[0].origin;
      newFlight.seats = element[0].seats;
      newFlight.toDateTime = element[0].approximateDateTimeEnd;

      //Is multihop
      if (element.length > 1) {
        let tempSum = 0;
        let tempPointsSum = 0;
        let tempDuration = 0;
        let tempIataId = '';
        let tempCities: string[] = [];
        let tempFlightId: number[] = [];
        let tempFlights: any[] = [];

        element.forEach((flight: any, index: number) => {
          tempPointsSum += flight.possibleLoyaltyPoints;
          tempSum += flight.seats[0].price;
          if (index == 0) {
            tempIataId +=
              flight.origin.iataId + ' to ' + flight.destination.iataId;
          } else {
            tempIataId += ' to ' + flight.destination.iataId;
          }
          tempCities.push(flight.origin.servicingArea.areaName);
          tempDuration +=
            new Date(flight.approximateDateTimeEnd).getTime() -
            new Date(flight.approximateDateTimeStart).getTime();
          tempFlightId.push(flight.id);
          tempFlights.push(flight);
        });

        let minutes = (tempDuration / (1000 * 60)) % 60;
        let hours = Math.floor((tempDuration / (1000 * 60 * 60)) % 24);

        newFlight.basePrice = formatter.format(tempSum);
        newFlight.cities = tempCities;
        newFlight.duration =
          hours + 'h ' + minutes + 'm' + ' Overall Flight duration';
        newFlight.durationInMilliseconds = tempDuration;
        newFlight.iataId = tempIataId;
        newFlight.loyaltyPoints = tempPointsSum;
        newFlight.route =
          'Multi-hop from ' +
          element[0].origin.name +
          ' to ' +
          element[element.length - 1].destination.name;
        newFlight.actualFlights = tempFlights;
      } else {
        let duration =
          new Date(element[0].approximateDateTimeEnd).getTime() -
          new Date(element[0].approximateDateTimeStart).getTime();
        let minutes = (duration / (1000 * 60)) % 60;
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        newFlight.basePrice = formatter.format(element[0].seats[0].price);
        newFlight.cities = [
          element[0].origin.servicingArea.areaName,
          element[0].destination.servicingArea.areaName,
        ];
        newFlight.duration = hours + 'h ' + minutes + 'm';
        newFlight.durationInMilliseconds = duration;
        newFlight.iataId =
          element[0].origin.iataId + ' to ' + element[0].destination.iataId;
        newFlight.loyaltyPoints = element[0].possibleLoyaltyPoints;
        newFlight.route =
          'Non-stop from ' +
          element[0].origin.name +
          ' to ' +
          element[0].destination.name;
        newFlight.actualFlights = [element[0]];
      }
      getCorrectFlights.push(newFlight);
    });

    //Once processing is done, check what type of flights the user wants
    if (this.nonStopRB == StopType.MULTIHOP) {
      return getCorrectFlights;
    } else {
      return getCorrectFlights.filter((x) => !x.multihop);
    }
  }

  initializePeopleString(): void {
    this.numberOfPeople = this.adult + ' Adult';
    if (this.countOfChildren > 0) {
      this.numberOfPeople += '; ' + this.countOfChildren + ' Children';
    }
  }

  toggleTicket(idNumber: any, event: any) {
    event.stopPropagation();

    //Close all overlays
    let overlays = document.getElementsByClassName(
      'overlayForAdditionalDetails'
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < overlays.length; i++) {
      overlays[i].style.display = 'none';
    }

    let idString = idNumber + '';
    (document.getElementById(idString) as HTMLElement).style.display =
      'initial';
  }

  close(idNumber: any) {
    let idString = idNumber + '';
    (document.getElementById(idString) as HTMLElement).style.display = 'none';
  }

  eventSort(sortMethod: string, id: string) {
    let specificElement = document.getElementById(id) as HTMLElement;

    //Checks if user want to remove the sort return back to default
    if (specificElement.classList.contains('selected')) {
      specificElement.classList.remove('selected');
      this.sort = SortMethod.EXPENSIVE;
      this.sortData();
      return;
    }

    //Else do these things
    let elements = document.getElementsByClassName(
      'hoverListItem'
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('selected');
    }

    specificElement.classList.add('selected');
    this.sort = sortMethod;
    this.sortData();
  }

  sortData() {
    let data = this.viewData;
    switch (this.sort) {
      case SortMethod.EXPENSIVE:
        data.sort(
          (a, b) =>
            b.basePrice.replace(/[$,]+/g, '') -
            a.basePrice.replace(/[$,]+/g, '')
        );
        break;
      case SortMethod.CHEAPEST:
        data.sort(
          (a, b) =>
            a.basePrice.replace(/[$,]+/g, '') -
            b.basePrice.replace(/[$,]+/g, '')
        );
        break;
      case SortMethod.OLDEST:
        data.sort(
          (a, b) => +new Date(a.creationTime) - +new Date(b.creationTime)
        );
        break;
      case SortMethod.MOST_RECENT:
        data.sort(
          (a, b) => +new Date(b.creationTime) - +new Date(a.creationTime)
        );
        break;
      case SortMethod.LOW_HOPS:
        data.sort((a, b) => a.numberOfHops - b.numberOfHops);
        break;
      case SortMethod.HIGH_HOPS:
        data.sort((a, b) => b.numberOfHops - a.numberOfHops);
        break;
      case SortMethod.SHORTEST_DURATION:
        data.sort(
          (a, b) => a.durationInMilliseconds - b.durationInMilliseconds
        );
        break;
      case SortMethod.LONGEST_DURATION:
        data.sort(
          (a, b) => b.durationInMilliseconds - a.durationInMilliseconds
        );
        break;
      default:
        data.sort(
          (a, b) =>
            b.basePrice.replace(/[$,]+/g, '') -
            a.basePrice.replace(/[$,]+/g, '')
        );
    }
    this.viewData = data;
  }

  changePagination(event: any) {
    this.paginationCount = event.target.value;
  }

  hideInputAndModal(): void {
    this.showModal = false;
    this.selectedFlight = <flight>{};
  }

  showOtherFlights(): void {
    this.hideInputAndModal();
    console.log('Check other flights');
    this.returning = false;

    this.viewData = this.returnFlightsData;
    this.lookingAtReturnFlights = true;
    this.sort = SortMethod.EXPENSIVE;
    this.filter = [];
    this.sortData();

    const sortRow = document.getElementById('sortRow') as HTMLElement;
    const sortRowExpanded = document.getElementById(
      'sortRowExpanded'
    ) as HTMLElement;
    sortRowExpanded.style.display = 'none';
    sortRow.style.display = 'block';

    //Remove all selected from sortExpanded

    const filterElements = document.getElementsByClassName(
      'hoverListItemA'
    ) as HTMLCollectionOf<HTMLElement>;
    const sortElements = document.getElementsByClassName(
      'hoverListItem'
    ) as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < filterElements.length; i++) {
      filterElements[i].classList.remove('selected');
    }

    for (let i = 0; i < sortElements.length; i++) {
      sortElements[i].classList.remove('selected');
    }
  }

  addFlightToCart(flight: any) {
    this.selectedFlight = flight;
    this.showModal = true;
  }

  toggleFilter(city: string) {
    const element = document.getElementById(city) as HTMLElement;
    if (element.classList.contains('selected')) {
      element.classList.remove('selected');

      //Get index of element in this.filter
      const index = this.filter.indexOf(city);
      if (index > -1) {
        this.filter.splice(index, 1);
      }
    } else {
      element.classList.add('selected');
      this.filter.push(city);
    }

    //Now we start filtering, then we need to look at processedlightData
    let tempList: any[];
    if (!this.lookingAtReturnFlights) {
      tempList = [...this.flightsData];
    } else {
      tempList = [...this.returnFlightsData];
    }

    let filteredList = tempList.filter((x: any) => {
      let tempCities: string[] = x.cities;
      const result = this.filter.every((val) => tempCities.includes(val));
      return result;
    });

    if (filteredList.length == 0) {
      this.noResultsErrorMsg = this.couldNotFindAnyResults;
    }
    this.viewData = filteredList;
    this.sortData();
  }

  toggleSortFilterDropdown() {
    const sortRow = document.getElementById('sortRow') as HTMLElement;
    const sortRowExpanded = document.getElementById(
      'sortRowExpanded'
    ) as HTMLElement;
    sortRow.style.display = 'none';
    sortRowExpanded.style.display = 'block';
  }

  closeSortDropdown() {
    const sortRow = document.getElementById('sortRow') as HTMLElement;
    const sortRowExpanded = document.getElementById(
      'sortRowExpanded'
    ) as HTMLElement;
    sortRowExpanded.style.display = 'none';
    sortRow.style.display = 'block';
  }
}

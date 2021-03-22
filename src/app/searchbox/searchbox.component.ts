import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  PersonType,
  StopType,
  TripType,
  WhereType,
} from '../shared/methods/flightsearchObjects';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css'],
})
export class SearchboxComponent implements OnInit {
  //Public Enum to keep track of constants
  TripType = TripType;
  StopType = StopType;
  PersonType = PersonType;
  WhereType = WhereType;

  @Input() fromModel: NgbDateStruct | undefined;
  @Input() toModel: NgbDateStruct | undefined;
  @Input() tripRB: string = TripType.ONE_WAY;
  @Input() nonStopRB: string = StopType.NON_STOP;
  @Input() numberOfPeople: string = '1 Adult';
  @Input() adult = 1;
  @Input() countOfChildren = 0;
  @Input() fromAirport: string = '';
  @Input() toAirport: string = '';
  @Input() fromCalendar: string = '';
  @Input() disableToCalendar = true;

  //Keeping track of the overlays
  overlay!: string;

  //variables to hold error messages for the user
  calendarErrorMsg: string = '';
  returnCalendarErrorMsg: string = '';
  toAirportErrorMsg: string = '';
  fromAirportErrorMsg: string = '';
  adultErrorMsg: string = '';

  //variable for the only disabled input
  placeHolder: string = 'No return date needed';
  minDate: NgbDateStruct;

  constructor(private router: Router) {
    //Need this inorder to disable calendar
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
  }

  ngOnInit(): void {}

  //Update the number of people function
  updateNumberOfPerson(person: string, event: any) {
    if (person == PersonType.ADULT) {
      let tempAdult = parseInt(event.target.value);
      if (tempAdult < 0) {
        this.adult = 1;
      } else {
        this.adult = tempAdult;
      }
    }
    if (person == PersonType.CHILDREN) {
      let tempChildren = parseInt(event.target.value);
      if (tempChildren < 0) {
        this.countOfChildren = 0;
      } else {
        this.countOfChildren = tempChildren;
      }
    }

    if (this.adult > 1) {
      this.numberOfPeople = this.adult + ' Adults';
    } else {
      this.numberOfPeople = this.adult + ' Adult';
    }
    if (this.countOfChildren > 0) {
      this.numberOfPeople += '; ' + this.countOfChildren + ' Children';
    }
  }

  //Closing overlay after end user makes a choice
  afterChoosingAnOption(overlay: string, choice: string, dataStore: string) {
    if ('tripRB' == dataStore) {
      this.tripRB = choice;
      this.closeOverlay(overlay);
      if (this.tripRB == TripType.ROUND_TRIP) {
        this.disableToCalendar = false;
        this.placeHolder = 'To: yyyy-mm-dd';
      } else {
        this.disableToCalendar = true;
        this.toModel = undefined;
        this.placeHolder = 'No return date needed';
      }
      return;
    }
    if ('nonStopRB' == dataStore) {
      this.nonStopRB = choice;
      this.closeOverlay(overlay);
      return;
    }
  }

  //Toggle the overlay after button press
  toggleOverlay(overlay: string, event: Event) {
    event.stopPropagation();

    //Check there is another overlay up
    if (this.overlay != '') {
      this.closeOverlay(this.overlay);
      this.overlay = '';
    }

    const overlayElement = document.getElementById(overlay);
    if (overlayElement != null) {
      overlayElement.style.display = 'initial';
      this.overlay = overlay;
    }
  }

  closeOverlay(overlay: string) {
    const overlayElement = document.getElementById(overlay);
    if (overlayElement != null) {
      overlayElement.style.display = 'none';
      this.overlay = '';
    }
  }

  //Set airport input from user
  setInput(event: any, where: string) {
    let tempVal = event.target.value;
    if (where == WhereType.FROM) {
      this.fromAirport = tempVal;
      return;
    }
    if (where == WhereType.TO) {
      this.toAirport = tempVal;
    }
  }

  //Weird swap magic
  swapLocations() {
    this.fromAirport = [this.toAirport, (this.toAirport = this.fromAirport)][0];
  }

  compareDates(
    date: NgbDateStruct | undefined,
    comparisonDate: NgbDateStruct | undefined
  ): boolean {
    if (date == undefined || comparisonDate == undefined) {
      return false;
    }
    let dateToCheck = new Date(date.year, date.month, date.day);
    let dateToCompare = new Date(
      comparisonDate.year,
      comparisonDate.month,
      comparisonDate.day
    );

    if (dateToCheck < dateToCompare) {
      return false;
    }
    return true;
  }

  checkAdultsAndChildren(): boolean {
    if (this.adult == 0) {
      this.adultErrorMsg = 'Atleast one adult needed';
      return false;
    }
    if (this.adult < 0 || this.countOfChildren < 0) {
      this.adultErrorMsg = 'Negative people do not exist D:';
      return false;
    }
    return true;
  }

  checkAirports(): boolean {
    if (this.fromAirport.length == 0) {
      this.fromAirportErrorMsg =
        'You need to include an airport to depart from!';
      return false;
    }
    if (this.toAirport.length == 0) {
      this.toAirportErrorMsg = 'You need to include a destination';
      return false;
    }
    return true;
  }

  checkFromDate(): boolean {
    const current = new Date();
    let minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };

    if (this.fromModel == undefined) {
      this.calendarErrorMsg = 'You need to include a date to fly!';
      return false;
    }
    if (!this.compareDates(this.fromModel, minDate)) {
      this.calendarErrorMsg = 'Cannot include a date in the past!';
      return false;
    }
    return true;
  }

  checkReturnIfReturnIsSpecified(): boolean {
    if (this.tripRB == TripType.ROUND_TRIP && this.toModel == undefined) {
      this.returnCalendarErrorMsg = 'Need to include a return date';
      return false;
    }
    if (
      this.tripRB == TripType.ROUND_TRIP &&
      !this.compareDates(this.toModel, this.fromModel)
    ) {
      this.returnCalendarErrorMsg = 'Return date must be after trip date';
      return false;
    }
    return true;
  }

  resetErrors(): void {
    this.returnCalendarErrorMsg = '';
    this.calendarErrorMsg = '';
    this.toAirportErrorMsg = '';
    this.fromAirportErrorMsg = '';
    this.adultErrorMsg = '';
  }

  search() {
    //Reset errors
    this.resetErrors();

    //Check if the search provided is valid~
    let searchValid =
      this.checkAdultsAndChildren() &&
      this.checkAirports() &&
      this.checkFromDate() &&
      this.checkReturnIfReturnIsSpecified();

    //Generate search parameters for URL
    if (searchValid) {
      //Have to do this black magic with the departure date to make in coincide with what the backend server wants
      let queryParamsInit: any = {
        origin: this.fromAirport,
        destinations: this.toAirport,
        departure:
          this.fromModel?.year +
          '-' +
          this.fromModel?.month.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }) +
          '-' +
          this.fromModel?.day.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }),
      };

      if (this.tripRB == TripType.ROUND_TRIP) {
        queryParamsInit['return'] =
          this.toModel?.year +
          '-' +
          this.toModel?.month.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }) +
          '-' +
          this.toModel?.day.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
      }

      queryParamsInit['adults'] = this.adult;

      if (this.countOfChildren > 0) {
        queryParamsInit['children'] = this.countOfChildren;
      }

      if (this.nonStopRB == StopType.MULTIHOP) {
        queryParamsInit['multiHop'] = true;
      }

      this.router.navigate(['/flight-search'], {
        queryParams: queryParamsInit,
      });
    }
  }
}

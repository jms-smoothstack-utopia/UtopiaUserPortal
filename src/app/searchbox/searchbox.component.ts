import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/methods/http.service';
import { environment } from 'src/environments/environment';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {

  @Input() fromModel: NgbDateStruct | undefined;
  @Input() toModel: NgbDateStruct | undefined;
  @Input() tripRB:string = "One-Way";
  @Input() nonStopRB: string = "Non-Stop";
  @Input() numberOfPeople: string = "1 Adult";
  @Input() adult = 1;
  @Input() countOfChildren = 0;
  @Input() fromAirport: string = "";
  @Input() toAirport: string = "";
  @Input() fromCalendar:string = "";
  @Input() disableToCalendar = true;

  //Keeping track of the overlays
  overlay!: string;

  //variables to hold airportData
  airportData: any;

  //variables to hold error messages for the user
  calendarErrorMsg:string = "";
  returnCalendarErrorMsg: string = "";
  toAirportErrorMsg:string = "";
  fromAirportErrorMsg: string = "";
  adultErrorMsg:string = "";

  //variable for the only disabled input
  placeHolder:string = "No return date needed";
  minDate: NgbDateStruct;

  constructor(private httpService: HttpService, private router: Router, private config: NgbDatepickerConfig) { 
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    }
  }

  ngOnInit(): void 
  {
    //get airport data from airport service

    let url = environment.airportsEndpoint;
    this.httpService.get(url).subscribe(
      (res:any) => 
      {
        if (res.length == 0){
          this.adultErrorMsg = "Utopia currently does not offer any airports we service";
          return;
        }
        let tempDict: {[key:string]: Array<string>} = {};
        for (let i = 0; i < res.length; i++){
            let airport = res[i];
            let servicingArea = airport["servicingArea"]["servicingArea"];
            if (servicingArea in tempDict){
              let airportList = tempDict[servicingArea];
              airportList.push(airport);
              tempDict[servicingArea] = airportList;
            }
            else{
              let tempList = [airport];
              tempDict[servicingArea] = tempList;
            }
        }
        this.airportData = tempDict;
      },
      (err: HttpErrorResponse) => 
      {
        console.log(err);
        this.adultErrorMsg = "There was an error getting our data. Please try again later.";
      },
    );
  }

  //Update the number of people function
  updateNumberOfPerson(person: string,event:any){
    if (person == "Adult"){
      this.adult = parseInt(event.target.value);
    }
    if (person == "Children"){
      this.countOfChildren = parseInt(event.target.value);
    }
    this.numberOfPeople = this.adult + " Adult";
    if(this.countOfChildren > 0){
      this.numberOfPeople += "; " + this.countOfChildren + " Children"; 
    }
  }

  //Closing overlay after end user makes a choice
  afterChoosingAnOption(overlay:string, choice:string, dataStore:string){
    if ("tripRB" == dataStore){
      this.tripRB = choice;
      this.closeOverlay(overlay);
      if(this.tripRB != "One-Way"){
          this.disableToCalendar = false;
          this.placeHolder = "To: yyyy-mm-dd";
      }
      else{
        this.disableToCalendar = true;
        this.toModel = undefined;
        this.placeHolder = "No return date needed";
      }
      return;
    }
    if("nonStopRB" == dataStore){
      this.nonStopRB = choice;
      this.closeOverlay(overlay);
      return;
    }
  }

  //Toggle the overlay after button press
  toggleOverlay(overlay: string, event: Event){
    event.stopPropagation();

    //Check there is another overlay up
    if (this.overlay != ""){
      this.closeOverlay(this.overlay);
      this.overlay = "";
    }

    const overlayElement = document.getElementById(overlay);
    if (overlayElement != null){
      overlayElement.style.display = "initial";
      this.overlay = overlay;
    }
  }

  closeOverlay(overlay: string){
    const overlayElement = document.getElementById(overlay);
    if (overlayElement != null){
      overlayElement.style.display = "none";
      this.overlay = "";
    }
  }

  //Set airport input from user
  setInput(event: any, where:string){
    let tempVal = event.target.value;
    if (where == "from"){
      this.fromAirport = tempVal;
      return;
    }
    if (where == "to"){
      this.toAirport = tempVal;
    }
  }

  swapLocations(){
    this.fromAirport = [this.toAirport, this.toAirport = this.fromAirport][0];
  }

  compareDates(date: NgbDateStruct | undefined, comparisonDate:NgbDateStruct | undefined){
    if (date == undefined || comparisonDate == undefined){
      return false;
    }
    if(date.year < comparisonDate.year){
      return false;
    }
    if (date.year > comparisonDate.year){
      return true;
    }
    if (date.month == comparisonDate.month){
      if (date.day < comparisonDate.day){
        return false;
      }
      return true;
    }
    if (date.month < comparisonDate.month){
      return false;
    }
    return true;
  }

  search(){

    const current = new Date();
    let minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    }

    let searchValid = true;
    if(this.adult == 0){
      this.adultErrorMsg = "Atleast one adult needed";
      setTimeout(() => this.adultErrorMsg = "", 5000);
      searchValid = false;
    }
    if(this.adult < 0 || this.countOfChildren < 0){
      this.adultErrorMsg = "Negative people do not exist D:";
      setTimeout(() => this.adultErrorMsg = "", 5000);
      searchValid = false;
    }
    if(this.fromAirport.length == 0){
      this.fromAirportErrorMsg = "You need to include an airport to depart from!";
      setTimeout(() => this.fromAirportErrorMsg = "", 5000);
      searchValid = false;
    }
    if(this.toAirport.length == 0){
      this.toAirportErrorMsg = "You need to include a destination";
      setTimeout(() => this.toAirportErrorMsg = "", 5000);
      searchValid = false;
    }
    if(this.fromModel == undefined){
      this.calendarErrorMsg = "You need to include a date to fly!";
      setTimeout(() => this.calendarErrorMsg = "", 5000);
      searchValid = false;
      return;
    }
    if (!this.compareDates(this.fromModel, minDate)){
      this.calendarErrorMsg = "Cannot include a date in the past!";
      setTimeout(() => this.calendarErrorMsg = "", 5000);
      searchValid = false;
    }
    if (this.tripRB == "Round-Trip" && this.toModel == undefined){
      this.returnCalendarErrorMsg = "Need to include a return date";
      setTimeout(() => this.returnCalendarErrorMsg = "", 5000);
      searchValid = false;
      return;
    }
    if(this.tripRB == "Round-Trip" && !this.compareDates(this.toModel, this.fromModel)){
      this.returnCalendarErrorMsg = "Return date must be after trip date";
      setTimeout(() => this.returnCalendarErrorMsg = "", 5000);
      searchValid = false;
    }

    if (searchValid){

      let queryParamsInit:any = {
        origin: this.fromAirport,
        destinations: this.toAirport, 
        departure: this.fromModel?.year + "-" + this.fromModel?.month.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}) + "-" + this.fromModel?.day.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}),
      };

      if(this.tripRB == "Round-Trip"){
        queryParamsInit["return"] = this.toModel?.year + "-" + this.toModel?.month.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false}) + "-" + this.toModel?.day.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});
      }

      queryParamsInit["adults"] = this.adult;

      if (this.countOfChildren > 0){
        queryParamsInit["children"] = this.countOfChildren;
      }

      if(this.nonStopRB == "Multihop"){
        queryParamsInit["multiHop"] = true;
      }

      this.router.navigate(['/flight-search'], {queryParams: queryParamsInit})
    }
  }

}

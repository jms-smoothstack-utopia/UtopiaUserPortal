import { Component, OnInit} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpService } from 'src/app/shared/methods/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';

@Component({
  selector: 'app-flightsearch',
  templateUrl: './flightsearch.component.html',
  styleUrls: ['./flightsearch.component.css']
})
export class FlightsearchComponent implements OnInit {


  //Data from query params which we will pass in to the flight search component
  tripRB:string = "One-Way";
  nonStopRB: string = "Non-Stop";
  adult: number = 1;
  children: number = 0;
  numberOfPeople: string = "1 Adult";
  fromAirport: string = "";
  toAirport: string = "";
  fromCalendar:string = "";
  toCalendar:string = "";
  disableToCalendar = true;

  fromModel: NgbDateStruct | undefined;
  toModel: NgbDateStruct | undefined;

  rawData:Array<any> = [];

  //Processed data list (only holds Origin to Destination)
  flightsData: Array<any> = [];

  //Process data list (only holds Destination to Origin)
  returnFlightsData: Array<any> = [];

  //Errors if there is a problem with searching and/or no results from database
  noResultsErrorMsg: string = "";
  returnTripErrorMsg: string = "";

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService) 
  { 

  }

  ngOnInit(): void 
  { 

    let tempFromAirport: any;
    let tempToAirport: any;
    let tempCalendarFrom: any;
    let tempCalendarTo:any;
    let tempAdults: any;
    let tempChildren: any;
    let tempNonStopRB: any;

    this.activatedRoute.queryParamMap.subscribe(params => {
      tempFromAirport = params.get("origin"),
      tempToAirport = params.get("destinations"),
      tempCalendarFrom= params.get("departure"),
      tempCalendarTo = params.get("return"),
      tempAdults = params.get("adults"),
      tempChildren = params.get("children"),
      tempNonStopRB = params.get("multiHop");

      this.fromAirport = (tempFromAirport == null ? "": tempFromAirport);
      this.toAirport = (tempToAirport == null ? "" : tempToAirport);
      this.fromCalendar = (tempCalendarFrom == null ? "" : tempCalendarFrom);
      
      if (this.fromCalendar != ""){
          //Create the model for the from calendar
          let tempFromCalendar:any = this.fromCalendar.split("-");
          this.fromModel = {
            year: parseInt(tempFromCalendar[0]),
            month: parseInt(tempFromCalendar[1]),
            day: parseInt(tempFromCalendar[2])
          }
      }

      this.toCalendar = (tempCalendarTo == null ? "": tempCalendarTo);

      if (this.toCalendar != ""){
        //Create the model for the to calendar
        let tempToCalendar:any = this.toCalendar.split("-");
        this.toModel = {
          year: parseInt(tempToCalendar[0]),
          month: parseInt(tempToCalendar[1]),
          day: parseInt(tempToCalendar[2])
        }
      } 

      this.tripRB = (this.toCalendar == "" ? "One-Way": "Round-Trip");
      this.disableToCalendar = (this.toCalendar == "" ? true: false);
      this.adult = (tempAdults == null ? 1 : parseInt(tempAdults));
      this.children = (tempChildren == null ? 0 : parseInt(tempChildren));
      this.nonStopRB = (tempNonStopRB == "true"? "Multihop": "Non-Stop");
      this.initializePeopleString();

      //These three parameters cannot be empty; they are mandatory
      if (this.fromAirport == "" || this.toAirport == "" || this.fromCalendar == ""){
        this.flightsData = [];
        this.noResultsErrorMsg = "Please include an origin, destination, and atleast a date when you want to fly"
      }
      else{

        //Now, we need to do the post request to get the flights data

        let baseSearchURL = environment.flightsEndpoint + "/flight-search?"

        //Add origin
        baseSearchURL += "origin=" + this.fromAirport + "&";
  
        //Add destination
        baseSearchURL += "destinations=" + this.toAirport + "&";
  
        //Add departure
        baseSearchURL += "departure=" + this.fromCalendar;

        if(this.toCalendar != ""){
          baseSearchURL += "&return=" + this.toCalendar;
        }
        
        let passengerCount = this.adult + this.children;
        if (passengerCount > 1){
          baseSearchURL += "&passengercount=" + passengerCount;
        }

        if (this.nonStopRB == "Multihop"){
          baseSearchURL += "&multihop=" + true;
        }

        //Do the post request
        this.httpService.get(baseSearchURL).subscribe(
          (res:any) => 
          {
            //We need to process search results
            this.rawData = res;
            this.processGetResults(res);
          },
          (err: HttpErrorResponse) => 
          {
            console.log(err);
            this.flightsData = [];
            this.noResultsErrorMsg = "There was an error processing your search. Please try again!"
          }
        );
      }
    });
  }

  processGetResults(res: any){
    let originToDestination = res["Origin to destination"];

    if (originToDestination.length == 0){
      this.flightsData = [];
      this.noResultsErrorMsg = "We could not find any flights with your search results. Please try again with different parameters";
    }
    else
    {
      this.flightsData = this.standardizeResults(originToDestination);
    }

    //So round trip
    if (this.tripRB != "One-Way"){
      let destinationToOrigin = res["Destination to origin"];

      if(destinationToOrigin.length == 0){
        this.returnFlightsData = [];
        this.returnTripErrorMsg = "We could not find any flights that return from your destination. Do you still want to view your results?";
      }
      else
      {
        this.returnFlightsData = this.standardizeResults(destinationToOrigin);
      }
    }
  }

  standardizeResults(data: Array<any>): Array<any>{
    //Create number formatter
    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    let getCorrectFlights:any = [];
    if (this.nonStopRB == "Multihop"){
      console.log("hello");
      data.forEach((element: any) => {
        let tempObject:any = {};

        //Only one flight
        if (element.length == 1){
          tempObject["iataId"] = element[0].origin.iataId + " to " + element[0].destination.iataId;
          tempObject["route"] = "Non-stop from " + element[0].origin.name + " to " + element[0].destination.name;
          tempObject["origin"] = element[0].origin;
          tempObject["destination"] = element[0].destination;
          tempObject["fromDateTime"] = element[0].approximateDateTimeStart;
          tempObject["toDateTime"] = element[0].approximateDateTimeEnd;
          let duration = new Date(element[0].approximateDateTimeEnd).getTime() - new Date(element[0].approximateDateTimeStart).getTime();
          let minutes = ((duration / (1000* 60)) % 60);
          let hours = Math.floor(((duration / (1000 * 60 * 60)) % 24));
          tempObject["duration"] = hours + "h " + minutes + "m";
          tempObject["loyaltyPoints"] = element[0].possibleLoyaltyPoints;
          tempObject["basePrice"] = formatter.format(element[0].seats[0].price);
          tempObject["multihop"] = false;
        }

        //More than one flight
        else{
          let tempPrice = 0;
          let tempLoyaltyPoints = 0;
          let tempDuration = 0;
          let tempIataId = "";
          let tempFromDateTime = "";
          let tempToDateTime = "";
          element.forEach((flight: any, index:number) => {
            tempLoyaltyPoints += flight.possibleLoyaltyPoints;
            tempPrice += flight.seats[0].price;

            if (index == 0){
              tempIataId += flight.origin.iataId + " to " + flight.destination.iataId;
            }
            else{
              tempIataId += " to " + flight.destination.iataId;
            }

            tempDuration += new Date(flight.approximateDateTimeEnd).getTime() - new Date(flight.approximateDateTimeStart).getTime();
            tempFromDateTime += flight.approximateDateTimeStart + "\n";
            tempToDateTime += flight.approximateDateTimeEnd + "\n";
          });

          tempObject["origin"] = element[0].origin;
          tempObject["destination"] = element[element.length - 1].destination;
          tempObject["basePrice"] = formatter.format(tempPrice);
          tempObject["loyaltyPoints"] = tempLoyaltyPoints;
          tempObject["fromDateTime"] = element[0].approximateDateTimeStart;
          tempObject["toDateTime"] = element[0].approximateDateTimeEnd;
          let firstFlightDuration = new Date(element[0].approximateDateTimeEnd).getTime() - new Date(element[0].approximateDateTimeStart).getTime()
          let minutes = ((firstFlightDuration / (1000* 60)) % 60);
          let hours = Math.floor(((firstFlightDuration / (1000 * 60 * 60)) % 24));
          tempObject["duration"] = hours + "h " + minutes + "m" + " #1 Flight Duration";
          tempObject["route"] = "Multi-hop from " + element[0].origin.name + " to " + element[element.length - 1].destination.name;
          tempObject["iataId"] = tempIataId;
          tempObject["multihop"] = true;
        }
        getCorrectFlights.push(tempObject);
      })
    }
    else{
      data.forEach((element:any) => {
        if (element.length == 1){
          let tempObject:any = {};
          tempObject["iataId"] = element[0].origin.iataId + " to " + element[0].destination.iataId;
          tempObject["route"] = "Non-stop from " + element[0].origin.name + " to " + element[0].destination.name;
          tempObject["origin"] = element[0].origin;
          tempObject["destination"] = element[0].destination;
          tempObject["fromDateTime"] = element[0].approximateDateTimeStart;
          tempObject["toDateTime"] = element[0].approximateDateTimeEnd;
          let duration = new Date(element[0].approximateDateTimeEnd).getTime() - new Date(element[0].approximateDateTimeStart).getTime();
          let minutes = ((duration / (1000* 60)) % 60);
          let hours = Math.floor(((duration / (1000 * 60 * 60)) % 24));
          tempObject["duration"] = hours + "h " + minutes + "m";
          tempObject["loyaltyPoints"] = element[0].possibleLoyaltyPoints;
          tempObject["basePrice"] = formatter.format(element[0].seats[0].price);
          tempObject["multihop"] = false;
          getCorrectFlights.push(tempObject);
        }
      });
    }
    return getCorrectFlights;
  }

  initializePeopleString(): void{
  this.numberOfPeople = this.adult + " Adult";
  if (this.children > 0){
    this.numberOfPeople += "; " + this.children + " Children"; 
    }
  }

  toggleTicket(idNumber:any, event:any){

    event.stopPropagation();

    //Close all overlay
    let overlays = document.getElementsByClassName("overlayForAdditionalDetails") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < overlays.length; i++){
      overlays[i].style.display = "none";
    }

    let idString = idNumber + "";
    (document.getElementById(idString) as HTMLElement).style.display = "initial";
  }

  close(idNumber:any){
    let idString = idNumber + "";
    (document.getElementById(idString) as HTMLElement).style.display = "none";
  }
}

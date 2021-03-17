import { Component, OnInit} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpService } from 'src/app/shared/methods/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

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
  countOfChildren: number = 0;
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

  //Processed data list (only holds Destination to Origin)
  returnFlightsData: Array<any> = [];

  //The list we tie to the frontend
  viewData: Array<any> = [];
  lookingAtReturnFlights: boolean = false;

  //Need to sort the data
  sort:string = "expensive";
  filter:Array<string> = [];

  //Holds cityData from backend
  cityData:Array<any> = [];

  //Holds generic pagination number
  paginationCount:number = 10;
  page:number = 1;

  //Errors if there is a problem with searching and/or no results from database
  noResultsErrorMsg: string = "";
  returnTripErrorMsg: string = "";

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService) 
  { 

  }

  ngOnInit(): void 
  { 

    this.activatedRoute.queryParams.subscribe(params => {
      let tempFromAirport = params["origin"]
      let tempToAirport = params["destinations"];
      let tempCalendarFrom= params["departure"];
      let tempCalendarTo = params["return"];
      let tempAdults = params["adults"];
      let tempChildren = params["children"];
      let tempNonStopRB = params["multiHop"];

      this.fromAirport = (tempFromAirport == null ? "": tempFromAirport);
      this.toAirport = (tempToAirport == null ? "" : tempToAirport);
      this.fromCalendar = (tempCalendarFrom == null ? "": tempCalendarFrom);
      
      if (this.fromCalendar != ""){
          //Create the model for the from calendar
          let tempFromCalendar:any = this.fromCalendar.split("-");

          if(tempFromCalendar.length != 3){
            this.flightsData = [];
            this.viewData = [];
            this.noResultsErrorMsg = "Input error"
            return;
          }

          this.fromModel = {
            year: parseInt(tempFromCalendar[0]),
            month: parseInt(tempFromCalendar[1]),
            day: parseInt(tempFromCalendar[2])
          }
      }

      this.toCalendar = (tempCalendarTo == null ? "" : tempCalendarTo);

      if (this.toCalendar != ""){
        //Create the model for the to calendar
        let tempToCalendar:any = this.toCalendar.split("-");

        if(tempToCalendar.length != 3){
          this.flightsData = [];
          this.viewData = [];
          this.noResultsErrorMsg = "Input error"
          return;
        }

        this.toModel = {
          year: parseInt(tempToCalendar[0]),
          month: parseInt(tempToCalendar[1]),
          day: parseInt(tempToCalendar[2])
        }
      } 

      this.tripRB = (this.toCalendar == "" ? "One-Way": "Round-Trip");
      this.disableToCalendar = (this.toCalendar == "" ? true: false);
      this.adult = (tempAdults == null ? 1 : parseInt(tempAdults));
      this.countOfChildren = (tempChildren == null ? 0 : parseInt(tempChildren));
      this.nonStopRB = (tempNonStopRB == "true"? "Multihop": "Non-Stop");
      this.initializePeopleString();

      //These three parameters cannot be empty; they are mandatory
      if (this.fromAirport == "" || this.toAirport == "" || this.fromCalendar == ""){
        this.flightsData = [];
        this.viewData = [];
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
        
        let passengerCount = this.adult + this.countOfChildren;
        if (passengerCount > 1){
          baseSearchURL += "&passengercount=" + passengerCount;
        }

        if (this.nonStopRB == "Multihop"){
          baseSearchURL += "&multihop=" + true;
        }

        //Do the GET request
        this.httpService.get(baseSearchURL).subscribe(
          (res:any) => 
          {
            //We need to process search results
            console.log(res);
            this.processGetResults(res);
          },
          (err: HttpErrorResponse) => 
          {
            console.log(err);
            this.viewData = [];
            this.noResultsErrorMsg = "There was an error processing your search. Please try again!"
          }
        );

        //Now get city information
        let servicingAreaURL = environment.servicingAreaEndpoint;

        this.httpService.get(servicingAreaURL).subscribe(
          (res:any) => 
          {
            res.forEach((element:any) => {
              if(!this.cityData.includes(element.servicingArea)){
                this.cityData.push(element.servicingArea);
              }
            });
            this.cityData.sort();
          },
          (err: HttpErrorResponse) =>
          {
            console.log(err);
            this.viewData = [];
            this.noResultsErrorMsg = "There was an error processing your search. Please try again!"
          }
        )
      }
    });
  }

  processGetResults(res: any){
    let originToDestination = res["Origin to destination"];

    if (originToDestination.length == 0){
      this.flightsData = [];
      this.viewData = [];
      this.noResultsErrorMsg = "We could not find any flights with your search results. Please try again with different parameters";
      return;
    }
    else
    { 
      let processedData = this.standardizeResults(originToDestination);
      if (processedData.length == 0){
        this.flightsData = [];
        this.viewData = [];
        this.noResultsErrorMsg = "We could not find any flights with your search results. Please try again with different parameters";
        return;
      }
      else{

        this.flightsData = processedData;
        //Tie it into the viewData list
        this.viewData = [...this.flightsData];
        this.sortData();
      }
    }

    //So round trip flights
    if (this.tripRB != "One-Way"){
      let destinationToOrigin = res["Destination to origin"];

      if(destinationToOrigin.length == 0){
        this.returnFlightsData = [];
        this.returnTripErrorMsg = "We could not find any flights that return from your destination. Do you still want to view your results?";
        return;
      }
      else
      { 
        let processedData = this.standardizeResults(destinationToOrigin);
        if (processedData.length == 0){
          this.returnFlightsData = [];
          this.returnTripErrorMsg = "We could not find any flights that return from your destination. Do you still want to view your results?";
          return;
        }
        else{
          //Do not make it viewdata; just need to store it
          this.returnFlightsData = processedData;
        }
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
      data.forEach((element: any) => {
        let tempObject:any = {};

        //Only one flight
        if (element.length == 1){
           tempObject = this.nonStopFlight(element);
        }

        //More than one flight
        else{
          let tempPrice = 0;
          let tempLoyaltyPoints = 0;
          let tempDuration = 0;
          let tempIataId = "";
          let tempCities = [];

          //Go through each element
          element.forEach((flight: any, index:number) => {
            tempLoyaltyPoints += flight.possibleLoyaltyPoints;
            tempPrice += flight.seats[0].price;
            if (index == 0){
              tempIataId += flight.origin.iataId + " to " + flight.destination.iataId;
            }
            else{
              tempIataId += " to " + flight.destination.iataId;
            }
            tempCities.push(flight.origin.servicingArea.servicingArea);
            tempDuration += new Date(flight.approximateDateTimeEnd).getTime() - new Date(flight.approximateDateTimeStart).getTime();
          });

          let economySeats = element[0].seats.filter((x:any) => x.seatClass == "ECONOMY" && x.seatStatus=="AVAILABLE");
          let businessSeats = element[0].seats.filter((x:any) => x.seatClass == "BUSINESS" && x.seatStatus=="AVAILABLE")
          tempObject["economy"] = economySeats.length;
          tempObject["business"] = businessSeats.length;
          tempObject["origin"] = element[0].origin;
          tempObject["airplane"] = element[0].airplane;
          tempObject["seats"] = element[0].seats;
          tempObject["destination"] = element[element.length - 1].destination;
          tempCities.push(element[element.length - 1].destination.servicingArea.servicingArea);
          tempObject["cities"] = tempCities;
          tempObject["basePrice"] = formatter.format(tempPrice);
          tempObject["loyaltyPoints"] = tempLoyaltyPoints;
          tempObject["fromDateTime"] = element[0].approximateDateTimeStart;
          tempObject["toDateTime"] = element[0].approximateDateTimeEnd;
          let minutes = ((tempDuration / (1000* 60)) % 60);
          let hours = Math.floor(((tempDuration / (1000 * 60 * 60)) % 24));
          tempObject["duration"] = hours + "h " + minutes + "m" + " Overall Flight duration";
          tempObject["route"] = "Multi-hop from " + element[0].origin.name + " to " + element[element.length - 1].destination.name;
          tempObject["iataId"] = tempIataId;
          tempObject["multihop"] = true;
          tempObject["numberOfHops"] = element.length;
          tempObject["creationTime"] = element[0].creationDateTime;
          tempObject["durationInMilliseconds"] = tempDuration;
        }
        getCorrectFlights.push(tempObject);
      })
    }
    else{
      data.forEach((element:any) => {
        if (element.length == 1){
          let tempObject = this.nonStopFlight(element);
          getCorrectFlights.push(tempObject);
        }
      });
    }
    return getCorrectFlights;
  }

  nonStopFlight(element:any){

    //Include the formatter
    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    //Start creating the object
    let tempObject:any = {};
    tempObject["iataId"] = element[0].origin.iataId + " to " + element[0].destination.iataId;
    tempObject["route"] = "Non-stop from " + element[0].origin.name + " to " + element[0].destination.name;
    tempObject["origin"] = element[0].origin;
    tempObject["cities"] = [element[0].origin.servicingArea.servicingArea, element[0].destination.servicingArea.servicingArea]
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
    tempObject["airplane"] = element[0].airplane;
    tempObject["seats"] = element[0].seats;
    let economySeats = element[0].seats.filter((x:any) => x.seatClass == "ECONOMY" && x.seatStatus=="AVAILABLE");
    let businessSeats = element[0].seats.filter((x:any) => x.seatClass == "BUSINESS" && x.seatStatus=="AVAILABLE")
    tempObject["economy"] = economySeats.length;
    tempObject["business"] = businessSeats.length;
    tempObject["creationTime"] = element[0].creationDateTime;
    tempObject["numberOfHops"] = element.length;
    tempObject["durationInMilliseconds"] = duration;
    return tempObject;
  }

  initializePeopleString(): void{
  this.numberOfPeople = this.adult + " Adult";
  if (this.countOfChildren > 0){
    this.numberOfPeople += "; " + this.countOfChildren + " Children"; 
    }
  }

  toggleTicket(idNumber:any, event:any){

    event.stopPropagation();

    //Close all overlays
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

  eventSort(sortMethod:string, id:string){

    let specificElement = document.getElementById(id) as HTMLElement;

    //Checks if user want to remove the sort return back to default
    if (specificElement.classList.contains("selected")){
      specificElement.classList.remove("selected");
      this.sort = "expensive";
      this.sortData();
      return;
    }

    //Else do these things
    let elements = document.getElementsByClassName("hoverListItem") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements.length; i++){
      elements[i].classList.remove("selected");
    }
    
    specificElement.classList.add("selected");
    this.sort = sortMethod;
    this.sortData();
  }

  sortData(){
    let data = this.viewData;
    switch(this.sort){
      case "expensive":
        data = data.sort((a,b) => b.basePrice.replace(/[$,]+/g,"") - a.basePrice.replace(/[$,]+/g,""));
      break;
      case "cheapest":
        data = data.sort((a,b) => a.basePrice.replace(/[$,]+/g,"") - b.basePrice.replace(/[$,]+/g,""));
        break;
      case "oldest":
          data = data.sort((a,b) => + new Date(a.creationTime) -  + new Date(b.creationTime));
          break;
      case "most recent":
          data = data.sort((a,b) => + new Date(b.creationTime) -  + new Date(a.creationTime));
          break;
      case "Low number of hops":
          data = data.sort((a,b) => a.numberOfHops - b.numberOfHops);
          break;
      case "High number of hops":
        data = data.sort((a,b) => b.numberOfHops - a.numberOfHops);
        break;
      case "Shortest duration":
        data = data.sort((a,b) => a.durationInMilliseconds - b.durationInMilliseconds);
        break;
      case "Longest duration":
        data = data.sort((a,b) => b.durationInMilliseconds - a.durationInMilliseconds);
        break;
      default:
        data = data.sort((a,b) => b.basePrice.replace(/[$,]+/g,"") - a.basePrice.replace(/[$,]+/g,""));
    }
    this.viewData = data;
  }

  changePagination(event: any){
    this.paginationCount = event.target.value;
  }


  //Maxwell, look here for booking
  addFlightToCart(flight:any){

    //Ideally, a modal would popup


    //However, at the moment, I will just populate the return flights for now
    if (this.tripRB == "Round-Trip" && this.returnFlightsData.length != 0){
      this.viewData = this.returnFlightsData;
      this.sortData;      
      this.lookingAtReturnFlights = true;

      //Then we need to reset filters and remove sort expanded

      this.filter = [];
      this.sort = "expensive";

      const sortRow = document.getElementById("sortRow") as HTMLElement;
      const sortRowExpanded = document.getElementById("sortRowExpanded") as HTMLElement;
      sortRowExpanded.style.display = "none";
      sortRow.style.display = "block";

      //Remove all selected from sortExpanded

      const filterElements = document.getElementsByClassName("hoverListItemA") as HTMLCollectionOf<HTMLElement>;
      const sortElements = document.getElementsByClassName("hoverListItem") as HTMLCollectionOf<HTMLElement>;

      for (let i = 0; i < filterElements.length; i ++){
        filterElements[i].classList.remove("selected");
      }

      for (let i = 0; i < sortElements.length; i++){
        sortElements[i].classList.remove("selected");
      }
    }
  }

  toggleFilter(city: string){
    const element = document.getElementById(city) as HTMLElement;
    if (element.classList.contains("selected")){
      element.classList.remove("selected");
      
      //Get index of element in this.filter
      const index = this.filter.indexOf(city);
      if (index > -1){
        this.filter.splice(index, 1);
      }
    } 
    else{
      element.classList.add("selected");
      this.filter.push(city);
    }

    //Now we start filtering, then we need to look at processedFlightData
    let tempList: any[];
    if (!this.lookingAtReturnFlights){
      tempList = [...this.flightsData];
    }
    else{
      tempList = [...this.returnFlightsData];
    }

    let filteredList = tempList.filter((x:any) => {
      let tempCities:string[] = x.cities;
      const result = this.filter.every(val => tempCities.includes(val));
      return result;
    });

    if (filteredList.length == 0){
      this.noResultsErrorMsg = "We could not find any flights with your filter results. Please filter again with different parameters";
    }
    this.viewData = filteredList;
  }

  toggleSortFilterDropdown(){
    const sortRow = document.getElementById("sortRow") as HTMLElement;
    const sortRowExpanded = document.getElementById("sortRowExpanded") as HTMLElement;
    sortRow.style.display = "none";
    sortRowExpanded.style.display = "block";
  }

  closeSortDropdown(){
    const sortRow = document.getElementById("sortRow") as HTMLElement;
    const sortRowExpanded = document.getElementById("sortRowExpanded") as HTMLElement;
    sortRowExpanded.style.display = "none";
    sortRow.style.display = "block";
  }
}

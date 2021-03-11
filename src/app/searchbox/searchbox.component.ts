import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/methods/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {

  //Airport inputs
  fromAirportInput:string = "";
  toAirportInput:string = "";
  fromAirportPossibleDestinations: Array<any> = [];
  fromAirportInnerHTML:string = "";
  toAirportPossibleDestinations: Array<any> = [];
  toAirportInnerHTML:string = "";

  //variables we will use to search
  tripRB = "One-Way";
  nonStopRB = "Non-Stop";
  numberOfPeople = "1 Adult";
  adult = 1;
  children = 0;
  fromAirport: Array<string> = [];
  toAirport: Array<string> = [];
  fromCalendar:string = "";
  toCalendar:string = "";

  //Keeping track of the overlays
  overlay!: string;

  //variables to hold airportData
  airportData: any;

  //variables to hold error messages for the user
  mainErrorMsg:string = "";
  calendarErrorMsg:string = "";
  toAirportErrorMsg:string = "";
  fromAirportErrorMsg: string = "";
  adultErrorMsg:string = "";

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit(): void 
  {
    //get airport data from airport service

    let url = environment.airportsEndpoint;
    this.httpService.get(url).subscribe(
      (res:any) => 
      {
        if (res.length == 0){
          this.mainErrorMsg = "Utopia currently does not offer any airports we service";
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
        if (Object.keys(tempDict).length > 0){
          this.airportData = tempDict;
        }
      },
      (err: HttpErrorResponse) => 
      {
        console.log(err);
        this.mainErrorMsg = "There was an error getting our data. Please try again later."
      },
    );
  }
  updateNumberOfPerson(person: string,event:any){
    if (person == "Adult"){
      this.adult = event.target.value;
    }
    if (person == "Children"){
      this.children = event.target.value;
    }
    this.numberOfPeople = this.adult + " Adult";
    if(this.children != 0){
      this.numberOfPeople += "; " + this.children + " Children"; 
    }
  }

  displayResult(result:any){
    console.log(result);
  }

  afterChoosingAnOption(overlay:string, choice:string, dataStore:string){
    if ("tripRB" == dataStore){
      this.tripRB = choice;
      this.closeOverlay(overlay);
      return;
    }
    if("nonStopRB" == dataStore){
      this.nonStopRB = choice;
      this.closeOverlay(overlay);
      return;
    }
  }

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

  airportSearch(event:any, where:string){
    if (where == "from"){
      this.fromAirportInput = event.target.value;
    }
    if(where == 'to'){
      this.toAirportInput = event.target.value;
    }
    let tempDict = Object.entries(this.airportData);

    //Make a list to contain processedInformation
    let processedSearch = [];
    for (let i = 0; i < tempDict.length; i++){
      if(event.target.value.toUpperCase() == tempDict[i][0].toUpperCase()){
        processedSearch.unshift(tempDict[i]);
      }
      else{
        let tempList:any =  tempDict[i][1];
        for(let j = 0; j < tempList.length; j++){
            let tempObject = tempList[j];

            //Get possible objects
            let tempIataId = tempObject["iataId"]
            if (event.target.value.toUpperCase() == tempIataId.toUpperCase()){
              processedSearch.unshift(tempObject);
              continue;
            }

            if(tempIataId.toUpperCase().includes(event.target.value.toUpperCase())){
              processedSearch.push(tempObject);
              continue;
            }

            let tempName = tempObject["name"];
            if (tempName.toUpperCase().includes(event.target.value.toUpperCase())){
              processedSearch.push(tempObject);
              continue;
            }

            let tempState = tempObject["state"];
            if (tempState.toUpperCase().includes(event.target.value.toUpperCase())){
              processedSearch.push(tempObject);
              continue;
            }
        }
      }
    }

    if(processedSearch.length > 0){
      let listOfLocations = this.goThroughList(processedSearch);
      if (where == "from"){
        this.fromAirportPossibleDestinations = processedSearch;
        this.fromAirport = listOfLocations;
      }
      else{
        this.toAirportPossibleDestinations = processedSearch;
        this.toAirport = listOfLocations
      }
    }
  }

  goThroughList(data:Array<any>){
    let cityCodes = [];
    for (let i = 0; i < data.length; i++){
      if (data[i].length != undefined){
        let tempCity = data[i][0];
        cityCodes.push(tempCity);
      }else{
        cityCodes.push(data[i]["iataId"]);
      }
    }
    return cityCodes;
  }

  addCalendar(event:any, where:string){
    if (where == "from"){
      this.fromCalendar = event.target.value;
      return;
    } 
    if (where == "to"){
      this.toCalendar = event.target.value;
      return;
    }
  }

  swapLocations(){
    this.fromAirportInput = [this.toAirportInput, this.toAirportInput = this.fromAirportInput][0];
    this.fromAirportPossibleDestinations = [this.toAirportPossibleDestinations, this.toAirportPossibleDestinations = this.fromAirportPossibleDestinations][0];
    this.fromAirportInnerHTML = [this.toAirportInnerHTML, this.toAirportInnerHTML = this.fromAirportInnerHTML][0];
    this.fromAirport = [this.toAirport, this.toAirport = this.fromAirport][0];
  }

  search(){
    let searchValid = true;
    if(this.adult == 0){
      this.adultErrorMsg = "Atleast one adult needed";
      setTimeout(() => this.adultErrorMsg = "", 5000);
      searchValid = false;
    }
    if(this.adult < 0 || this.children < 0){
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
    if(this.fromCalendar == ""){
      this.calendarErrorMsg = "You need to include a date to fly!";
      setTimeout(() => this.calendarErrorMsg = "", 5000);
      searchValid = false;
    }
    if (this.tripRB == "Round-Trip" && this.toCalendar == ""){
      this.calendarErrorMsg = "You need to include a return date if you want a round-trip!";
      setTimeout(() => this.calendarErrorMsg = "", 5000);
      searchValid = false;
    }
    if (searchValid){
      //After we check search is valid, then we need to construct the url to navigate to another page
      let baseSearchURL = environment.flightsEndpoint + "/flight-search?";
      
      //Add origin sites
      this.fromAirport.forEach(element => {
        baseSearchURL += "origin=" + element + "&";
      });

      //Add destinations sites
      this.toAirport.forEach(element => {
        baseSearchURL += "destinations=" + element + "&";
      })
      
      //Add departure date
      baseSearchURL += "departure=" + this.fromCalendar + "&";

      //Add return date if included
      if (this.toCalendar != ""){
        baseSearchURL += "return=" + this.toCalendar + "&";
      }

      //Add passenger count
      let passengerCount = this.adult + this.children;
      if (passengerCount > 1){
        baseSearchURL += "passengercount=" + passengerCount + "&";
      }

      if (baseSearchURL[baseSearchURL.length - 1] == "&"){
        baseSearchURL = baseSearchURL.slice(0,-1);
      }

      console.log(baseSearchURL);
      this.httpService.get(baseSearchURL).subscribe(
        (res:any) => {console.log(res)},
        (err: HttpErrorResponse) => {console.log(err)}
      )

      let queryParamsInit = {
        origin: this.fromAirport,
        destinations: this.toAirport, 
        departure: this.fromCalendar, 
        return: this.toCalendar, 
        passengecount: passengerCount,
      };

      this.router.navigate(['/flight-search'], {queryParams: queryParamsInit})
    }
  }

}

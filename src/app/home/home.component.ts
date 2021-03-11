import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/methods/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  //Airport inputs
  fromAirportInput:string = "";
  toAirportInput:string = "";
  fromAirportPossibleDestinations: Array<any> = [];
  fromAirportInnerHTML:string = "";
  toAirportPossibleDestinations: Array<any> = [];
  toAirportInnterHTMl:string = "";

  //Airport HTML
  fromAirportHTML:string = "";

  //variables we will use to search
  tripRB = "One-Way";
  nonStopRB = "Non-Stop";
  numberOfPeople = "1 Adult";
  adult = 1;
  children = 0;
  fromAirport: Array<string> = [];
  toAirport: Array<string> = [];

  //Keeping track of the overlays
  overlay!: string;

  //variables to hold airportData
  airportData: any;

  //variables to hold error messages for the user
  mainErrorMsg:string = "";

  //tempValues
  city = "D.C";
  where = "from";

  constructor(private httpService: HttpService) {}

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
    this.fromAirportInput = event.target.value;
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
    if (where == "from"){
      this.fromAirportPossibleDestinations = processedSearch;
      if (processedSearch.length > 0){
        this.processInnerHTML(where, processedSearch);
      }
    }
    else{
      this.toAirportPossibleDestinations = processedSearch;
      if (processedSearch.length > 0){
        this.processInnerHTML(where, processedSearch);
      }
    }
  }

  captureItem(event:any, where:string){
    console.log(event);
  }

  //We found data based on user input
  processInnerHTML(where:string, data:Array<any>){
    let htmlString:string = "";
    let rowCount:number = 0;
    for (let i = 0; i < data.length; i++){

      if(data[i].length != undefined){
        this.city = data[i][0];
        this.where = where;
        console.log("SERVICE AREA");
        rowCount += 1;
        htmlString += "<app-servicingareadrop [city]='city' [where]= 'where' (result)='displayResult($event)'></app-servicingareadrop>";
      }
    }

    if (where == "from"){
      this.fromAirportInnerHTML = htmlString;
    } else{
      this.toAirportInnterHTMl = htmlString;
    }
  }
}

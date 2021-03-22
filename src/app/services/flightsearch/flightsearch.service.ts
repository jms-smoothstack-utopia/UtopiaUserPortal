import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

//Todo Try and catch

export class FlightsearchService {

  private flightsURL = environment.flightsEndpoint;
  private servicingAreaURL = environment.servicingAreaEndpoint;

  constructor(private http: HttpClient) { }

  getFlights(searchItems: string){
    const url = this.flightsURL + "/flight-search?" + searchItems;
    return this.http.get(url);
  }

  getServicingArea(){

    interface servicingArea{
      id: number,
      areaName: string
    }

    const url = this.servicingAreaURL;
    return this.http.get<servicingArea[]>(url);
  }
}

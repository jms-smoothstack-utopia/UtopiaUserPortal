import { Component, OnInit } from '@angular/core';
import { environment } from "../../environments/environment";
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map?: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 38.8951;
  lng = -77.0364;

  constructor() { }

  ngOnInit() {
      this.map = new mapboxgl.Map({
        accessToken: environment.mapbox.accessToken,
        container: 'map',
        style: this.style,
        zoom: 7,
        center: [this.lng, this.lat]
    });
    
    this.map.addControl(new mapboxgl.NavigationControl());
  }

}

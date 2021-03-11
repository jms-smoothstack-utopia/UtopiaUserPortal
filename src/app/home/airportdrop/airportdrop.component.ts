import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-airportdrop',
  templateUrl: './airportdrop.component.html',
  styleUrls: ['./airportdrop.component.css']
})
export class AirportdropComponent implements OnInit {

  @Input() airport:string = "";
  @Input() where:string = "";

  @Output() result = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  captureItem(event:any){
    let checked = event.target.checked;
    let value = event.target.value;
    let returnObject = {
      checkbox: checked,
      returnValue: value,
      toWhere: this.where,
    }
    this.result.emit(returnObject);
  }

}

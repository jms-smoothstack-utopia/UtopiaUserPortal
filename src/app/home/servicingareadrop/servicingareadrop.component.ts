import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-servicingareadrop',
  templateUrl: './servicingareadrop.component.html',
  styleUrls: ['./servicingareadrop.component.css']
})
export class ServicingareadropComponent implements OnInit {

  @Input() city:string = "";
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

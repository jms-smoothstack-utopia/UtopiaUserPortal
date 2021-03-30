import { Component, OnInit } from '@angular/core';
import { TicketsList } from '../ticket';

@Component({
  selector: 'app-user-flight-history',
  templateUrl: './user-flight-history.component.html',
  styleUrls: ['./user-flight-history.component.css'],
})
export class UserFlightHistoryComponent implements OnInit {
  activeForNav: string = 'history';
  listType = TicketsList.HISTORY;

  constructor() {}

  ngOnInit(): void {}
}

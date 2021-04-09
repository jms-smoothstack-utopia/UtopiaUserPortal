import { Component, OnInit } from '@angular/core';
import { TicketsList } from '../ticket';

@Component({
  selector: 'app-user-flight-upcoming',
  templateUrl: './user-flight-upcoming.component.html',
  styleUrls: ['./user-flight-upcoming.component.css'],
})
export class UserFlightUpcomingComponent implements OnInit {
  activeForNav: string = 'upcoming';
  listType = TicketsList.UPCOMING;

  constructor() {}

  ngOnInit(): void {}
}

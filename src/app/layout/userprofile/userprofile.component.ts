import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/methods/http.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  loyaltyPoints?:any;

  constructor(private httpService: HttpService) {
   }

  ngOnInit(): void {
  }

}

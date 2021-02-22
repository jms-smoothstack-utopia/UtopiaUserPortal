import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../user';
import { Address } from '../address';
import { UserService } from "../user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  getUser(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    //have to do this check since the application is in strict mode
    if (rawId === null) {
      //TODO: do some kind of error thing
    } else {
      const id = +rawId;  //cast rawId as a number
      //this.userService.getUser(id).subscribe(myUser => this.user = myUser);
      this.userService.getUser(id).subscribe(myUser => this.user = myUser);
    }
  }

  ngOnInit(): void {
    this.getUser();
  }

}

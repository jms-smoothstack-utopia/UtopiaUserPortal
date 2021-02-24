import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resetform',
  templateUrl: './resetform.component.html',
  styleUrls: ['./resetform.component.css']
})
export class ResetformComponent implements OnInit {
  userToken: any

  constructor(private route:ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.userToken = params["token"];
    });
   }

  ngOnInit(): void {
  }

}

import { Component, OnInit, setTestabilityGetter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToForgetPasswordPage(){
    this.router.navigateByUrl("/login/forgotpassword");
  }

  makeAnAccount(){
    this.router.navigateByUrl("/login/accountmaker");
  }
}

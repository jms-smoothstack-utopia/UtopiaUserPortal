import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { flight } from '../methods/flightsearchObjects';
import { FlightSeatType, seatAvailable, bookingInfo } from "../methods/flightsearchObjects";
import { CartService } from "../../services/cart/cart.service";

@Component({
  selector: 'app-flightmodal',
  templateUrl: './flightmodal.component.html',
  styleUrls: ['./flightmodal.component.css']
})

export class FlightmodalComponent implements OnInit {

  //Public enums
  FlightSeatType = FlightSeatType;

  //Disable button depending on if this is the end
  disabledButton:boolean = true;

  //Input and Outputs
  @Input() flightInfo:flight = <flight>{};
  @Input() adult:number = 1;
  @Input() areWeReturning: boolean = false;
  @Input() countOfChildren: number = 0;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() lookAtOtherFlights = new EventEmitter<void>();

  showTicketButtonAction: boolean = false;
  numberOfPeople :number = 1;

  //List to hold seatAvailabilty
  seatsAvailability: seatAvailable[] = [];

  //List to hold userChoice
  userChoice: bookingInfo[] = [];

  //List AddToCart
  addToCartShow:boolean = false;

  constructor(private router: Router, private cart: CartService) {}

  ngOnInit(): void {

    this.numberOfPeople = this.adult + this.countOfChildren;

    //Need to get seat availability for all flights
    if (!!this.flightInfo.actualFlights) {
      this.flightInfo.actualFlights.forEach((element:any) => {
        let seatOptions = <seatAvailable>{};
        seatOptions.flightId = element.id;
        seatOptions.economy = element.seats.filter((x:any) => x.seatClass == "ECONOMY" && x.seatStatus=="AVAILABLE").length;
        seatOptions.business = element.seats.filter((x:any) => x.seatClass == "BUSINESS" && x.seatStatus=="AVAILABLE").length;
        this.seatsAvailability.push(seatOptions);
      });
    }
  }

  onClose():void{
    this.closeEvent.emit();
  }

  lookAtReturningFlight(): void{
    this.lookAtOtherFlights.emit();
  }

  goBackToHomePage(){
    this.router.navigateByUrl("/", {replaceUrl: true});
  }

  captureUserResponse(event:any, flight:any, index:number){

    let progressbar = document.getElementById("progressBar") as HTMLElement;
    let targetValue = event.target.value;

    //Get the HTML Elements
    let economyHTMLElement = document.getElementById(FlightSeatType.ECONOMY + "_" + index) as HTMLElement;
    let businessHTMLElement = document.getElementById(FlightSeatType.BUSINESS + "_" + index) as HTMLElement;

    economyHTMLElement.classList.remove("selected");
    businessHTMLElement.classList.remove("selected");

    if (event.target.value == FlightSeatType.ECONOMY){
      economyHTMLElement.classList.add("selected");
    }else{
      businessHTMLElement.classList.add("selected");
    }

    let pickedFlightId = flight.id;
    let userChoosesFlight = <bookingInfo>{};
    userChoosesFlight.flightId = pickedFlightId;
    userChoosesFlight.flight = flight;
    userChoosesFlight.numberOfPeople = this.numberOfPeople;
    userChoosesFlight.seatClass = targetValue;

    let alreadyThere: boolean = false;
    for (let i = 0; i < this.userChoice.length; i++){
      if (this.userChoice[i].flightId == pickedFlightId){
        this.userChoice[i] = userChoosesFlight;
        alreadyThere = true;
      }
    }
    if (alreadyThere == false){
      this.userChoice.push(userChoosesFlight);
    }

    let width = (this.userChoice.length / this.seatsAvailability.length) * 100;
    progressbar.style.width = width + "%";

    if (this.userChoice.length == this.seatsAvailability.length){
      this.addToCartShow = true;
    }
  }

  goToCart(): void {
    this.router.navigateByUrl("/shopping-cart");
  }

  AddToCart(): void {
    this.userChoice.forEach(x => {
      this.cart.addToCart(x);
    })
    this.showTicketButtonAction = true;
    if (this.areWeReturning == false){
      this.disabledButton = false;
    }else{
      this.disabledButton = true;
    }
  }
}

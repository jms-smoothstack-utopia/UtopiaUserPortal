import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-returnalert',
  templateUrl: './returnalert.component.html',
  styleUrls: ['./returnalert.component.css']
})
export class ReturnalertComponent implements OnInit {
  @Input() message?: string;
  @Input() moreInfo?: string;
  @Output() closeEvent = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onClose() {
    this.message = undefined;
    this.closeEvent.emit();
  }

  goBackToHomePage(){
    this.router.navigateByUrl("/", {replaceUrl: true});
  }
}

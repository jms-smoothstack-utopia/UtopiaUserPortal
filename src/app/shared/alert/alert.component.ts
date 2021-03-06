import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  @Input() message?: string;
  @Input() moreInfo?: string;
  @Output() closeEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onClose() {
    this.message = undefined;
    this.closeEvent.emit();
  }
}

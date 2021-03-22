import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import PathConstants from 'src/environments/paths';

@Component({
  selector: 'app-cancel-ticket',
  templateUrl: './cancel-ticket.component.html',
  styleUrls: [
    '../shared/alert/alert.component.css',
    './cancel-ticket.component.css',
  ],
})
export class CancelTicketComponent implements OnInit {
  @Input() ticketId: number | undefined;
  @Input() flightTime: Date | undefined;
  @Input() alreadyCancelled: boolean | undefined;
  @Output() closeEvent = new EventEmitter<void>();
  isLoading: boolean = false;
  cancelConfirmed: boolean = false;
  badCancel: boolean = false;
  badCancelMessage?: string;
  errorMessage?: string;

  constructor(
    private flightRecordsService: FlightRecordsService,
    private log: NGXLogger,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkCanCancel();
  }

  checkCanCancel(): void {
    //if flight time less than now, i.e. in the past
    if (this.flightTime && this.flightTime < new Date(Date.now())) {
      this.badCancel = true;
      this.badCancelMessage =
        'This booking is for a past flight and cannot be cancelled.';
    }
    if (this.alreadyCancelled) {
      this.badCancel = true;
      this.badCancelMessage = 'This booking has already been cancelled.';
      //conveniently, this overwrites the past message in the event of a past cancellation
    }
  }

  goBack(): void {
    if (this.cancelConfirmed) {
      //if cancel confirmed, refresh the page
      this.finishCancellation();
    } else {
      this.badCancel = false;
      this.badCancelMessage = undefined;
      this.cancelConfirmed = false;
      this.errorMessage = undefined;
      this.isLoading = false;
      this.closeEvent.emit();
    }
  }

  finishCancellation(): void {
    this.router.navigate([PathConstants.TICKET_DETAIL, this.ticketId]);
  }

  onRetryFromError(): void {
    this.errorMessage = undefined;
  }

  confirmCancel(): void {
    this.isLoading = true;
    if (this.ticketId !== undefined) {
      this.flightRecordsService.cancelTicketById(this.ticketId).subscribe(
        (res) => {
          this.log.info('ticket successfully cancelled');
          this.isLoading = false;
          this.cancelConfirmed = true;
        },
        (err) => {
          this.log.error('error in cancel-ticket:');
          this.log.error(err);
          this.isLoading = false;
          this.errorMessage = 'Cancellation failed, please try again later.';
        }
      );
    }
  }
}

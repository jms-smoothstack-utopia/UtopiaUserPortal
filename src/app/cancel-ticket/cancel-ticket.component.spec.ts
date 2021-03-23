import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTicketComponent } from './cancel-ticket.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  LoggerConfig,
  NGXLogger,
  NGXLoggerHttpService,
  NgxLoggerLevel,
  NGXMapperService,
} from 'ngx-logger';
import {
  NGXLoggerHttpServiceMock,
  NGXMapperServiceMock,
} from 'ngx-logger/testing';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FlightRecordsService } from '../services/flight-records/flight-records.service';
import { of, throwError } from 'rxjs';

describe('CancelTicketComponent', () => {
  let component: CancelTicketComponent;
  let fixture: ComponentFixture<CancelTicketComponent>;
  let flightRecordsServiceSpy: FlightRecordsService;
  const mockTicketId = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelTicketComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, AppRoutingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    flightRecordsServiceSpy = fixture.debugElement.injector.get(
      FlightRecordsService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('confirmCancel should call cancelTicketById', () => {
    const cancelFunction = spyOn(
      flightRecordsServiceSpy,
      'cancelTicketById'
    ).and.returnValue(of({}));

    component.ticketId = 1;
    component.confirmCancel();

    expect(cancelFunction).toHaveBeenCalledWith(mockTicketId);
  });

  it('confirmCancel should set error stuff if it gets an error back', () => {
    const cancelFunction = spyOn(
      flightRecordsServiceSpy,
      'cancelTicketById'
    ).and.returnValue(throwError('this is an error'));

    component.ticketId = 1;
    component.confirmCancel();
    expect(component.errorMessage).toEqual(
      'Cancellation failed, please try again later.'
    );
  });

  it('goBack should emit close event', () => {
    const emitter = spyOn(component.closeEvent, 'emit');
    component.goBack();
    expect(emitter).toHaveBeenCalled();
  });

  it('goBack should call finishCancellation if cancel succeeded', () => {
    component.cancelConfirmed = true;
    const finish = spyOn(component, 'finishCancellation');

    component.goBack();
    expect(finish).toHaveBeenCalled();
  });

  it('onRetryFromError should clear the error message', () => {
    component.errorMessage = 'foo';

    expect(component.errorMessage).toEqual('foo');
    component.onRetryFromError();
    expect(component.errorMessage).toBeUndefined;
  });

  it('checkCanCancel should check for when you cannot cancel based on time', () => {
    component.flightTime = new Date(Date.now() - 1000);

    component.checkCanCancel();
    expect(component.badCancel).toBeTrue();
    expect(component.badCancelMessage).toEqual(
      'This booking is for a past flight and cannot be cancelled.');
  });

  it('checkCanCancel should check for when the ticket is already cancelled', () => {
    component.alreadyCancelled = true;

    component.checkCanCancel();
    expect(component.badCancel).toBeTrue();
    expect(component.badCancelMessage).toEqual(
      'This booking has already been cancelled.');
  });
});

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
import { of } from 'rxjs';

describe('CancelTicketComponent', () => {
  let component: CancelTicketComponent;
  let fixture: ComponentFixture<CancelTicketComponent>;
  let flightRecordsServiceSpy: FlightRecordsService;
  const mockTicketId = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelTicketComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppRoutingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    flightRecordsServiceSpy = fixture.debugElement.injector.get(FlightRecordsService);
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

  it('goBack should emit close event', () => {
    const emitter = spyOn(component.closeEvent, 'emit');
    component.goBack();
    expect(emitter).toHaveBeenCalled();
  });
});

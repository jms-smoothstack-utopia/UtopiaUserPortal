import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
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

import { ResetformComponent } from './resetform.component';

describe('ResetformComponent', () => {
  let component: ResetformComponent;
  let fixture: ComponentFixture<ResetformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule
       ],
      declarations: [ ResetformComponent ],
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
    fixture = TestBed.createComponent(ResetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

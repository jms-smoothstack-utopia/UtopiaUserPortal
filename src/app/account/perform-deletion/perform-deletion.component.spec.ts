import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformDeletionComponent } from './perform-deletion.component';
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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';

describe('PerformDeletionComponent', () => {
  let component: PerformDeletionComponent;
  let fixture: ComponentFixture<PerformDeletionComponent>;
  let authServiceSpy: AuthService;
  let activatedRouteSpy: ActivatedRoute;
  let routerSpy: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerformDeletionComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'some-token',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authServiceSpy = fixture.debugElement.injector.get(AuthService);
    activatedRouteSpy = fixture.debugElement.injector.get(ActivatedRoute);
    routerSpy = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #confirmDeletion', () => {
    const fn = spyOn(authServiceSpy, 'confirmDeletion').and.returnValue(of({}));
    component.ngOnInit();
    expect(fn).toHaveBeenCalledWith('some-token');
  });

  it('should have an error if no token', () => {
    spyOn(activatedRouteSpy.snapshot.paramMap, 'get').and.returnValue(null);
    const navigate = spyOn(routerSpy, 'navigate');
    component.ngOnInit();
    expect(spyOn(authServiceSpy, 'confirmDeletion')).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicingareadropComponent } from './servicingareadrop.component';

describe('ServicingareadropComponent', () => {
  let component: ServicingareadropComponent;
  let fixture: ComponentFixture<ServicingareadropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicingareadropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicingareadropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

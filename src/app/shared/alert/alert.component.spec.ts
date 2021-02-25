import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty if no error message given', () => {
    component.message = undefined;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div')).toBeFalsy();
  });

  it('should have the error message given by input as the inner text', () => {
    component.message = 'some error';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p').innerText).toEqual(
      'some error'
    );
  });
});

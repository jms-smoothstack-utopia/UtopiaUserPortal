import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReturnalertComponent } from './returnalert.component';

let routerSpy = {navigateByUrl: jasmine.createSpy('navigateByUrl')};

describe('ReturnalertComponent', () => {
  let component: ReturnalertComponent;
  let fixture: ComponentFixture<ReturnalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnalertComponent ],
      providers: [
        { provide: Router, useValue:routerSpy }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should be empty if no message was given to the box", () => {
    component.message = undefined;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')).toBeFalsy();
  });

  it("should have the error message given as an input as innerHTML", () => {
    component.message = "some error";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("p").innerText).toEqual("some error");
  });

  it("should navigate away if navigateToHomePage button is pressed", () => {
    component.message = "some error";
    fixture.detectChanges();

    spyOn(component, 'goBackToHomePage');
    let button = fixture.debugElement.nativeElement.querySelector("#homeButton");
    button.click();
    
    expect(component.goBackToHomePage).toHaveBeenCalled();
  })

  it("should close box if close button is pressed", () => {
    component.message = "some error";
    fixture.detectChanges();

    spyOn(component, 'onClose');
    let button = fixture.debugElement.nativeElement.querySelector("#closeButton");
    button.click();
    
    expect(component.onClose).toHaveBeenCalled();
  })
});

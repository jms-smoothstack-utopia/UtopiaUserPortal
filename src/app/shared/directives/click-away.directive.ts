import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickAway]'
})
export class ClickAwayDirective {

  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(target:Event){
    const clickedInside = this.el.nativeElement.contains(target);
    if (!clickedInside){
      this.clickOutside.emit();
    }
  }
}

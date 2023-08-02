import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type="number"][maxlength]'
})
export class NumberMaxLengthDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const maxLength = this.el.nativeElement.getAttribute('maxlength');
    if (value.length > maxLength) {
      this.el.nativeElement.value = value.slice(0, maxLength);
    }
  }
}




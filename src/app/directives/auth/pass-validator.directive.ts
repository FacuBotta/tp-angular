import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Optional,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPassValidator]',
  standalone: true,
})
export class PassValidatorDirective {
  @Input('appPassValidator') mainPassword: string | null = '';

  private passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  constructor(
    private el: ElementRef,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  @HostListener('input')
  onInput() {
    const control = this.ngControl.control;
    if (!control) return;

    const value = control.value;
    const errors = control.errors || {};
    if (this.el.nativeElement.id === 'confirm-password') {
      if (value && value.toLowerCase() !== this.mainPassword?.toLowerCase()) {
        errors['invalidRepeatPassword'] = true;
      } else {
        delete errors['invalidRepeatPassword'];
      }
    }

    if (value && !this.passwordPattern.test(value)) {
      errors['invalidPassword'] = true;
    } else {
      delete errors['invalidPassword'];
    }

    control.setErrors(Object.keys(errors).length ? errors : null);
  }
}

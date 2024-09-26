import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appPopupError]',
  standalone: true,
})
export class PopupErrorDirective implements OnChanges {
  @Input('appPopupError') message: any;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message'] && this.message) {
      const errorMessages = this.formatErrorMessages(this.message);
      this.el.nativeElement.innerText = errorMessages;
    } else {
      this.el.nativeElement.innerText = '';
    }
  }

  private formatErrorMessages(errors: any): string {
    if (!errors) return '';

    const errorMessages: string[] = [];
    if (errors.required) {
      errorMessages.push('Le champ est obligatoire');
    }
    if (errors.email) {
      errorMessages.push("Le email n'est pas valide");
    }
    if (errors.maxlength) {
      errorMessages.push(
        `Max de characters ${errors.maxlength.requiredLength}`
      );
    }
    if (errors.invalidPassword) {
      errorMessages.push(
        'min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial'
      );
    }
    if (errors.invalidRepeatPassword) {
      errorMessages.push('Les mots de passe ne correspondent pas');
    }

    return errorMessages.join(' | ');
  }
}

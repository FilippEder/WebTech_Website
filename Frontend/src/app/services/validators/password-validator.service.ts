import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';

export function passwordValidator():AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors|null>=>{

    const value:string = control.value || ''

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*]/.test(value);
    const hasMinLength = value.length >= 8;


    if (!hasUpperCase) {
      return of({invalidPassword: true})
    }
    if (!hasLowerCase) {
      return of({invalidPassword: true})
    }
    if (!hasDigit) {
      return of({invalidPassword: true})
    }
    if (!hasSpecialChar) {
      return of({invalidPassword: true})
    }
    if (!hasMinLength) {
      return of({invalidPassword: true})
    }

    return of(null);
  }
}

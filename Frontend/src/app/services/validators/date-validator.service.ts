import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable, of} from 'rxjs';


export function dateRangeValidator():AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors|null>=>{

    const value = control.value;
    if (!value) return of(null);

    const inputDate = new Date(value)
    const minDate = new Date('1900-01-01')
    const maxDate = new Date()

    if (isNaN(inputDate.getTime())) {
      return of({invalidDate: true})
    }

    if (inputDate < minDate) {
      return of({invalidDate: true})
    }

    if (inputDate > maxDate) {
      return of({invalidDate: true})
    }

    return of(null);
  }
}


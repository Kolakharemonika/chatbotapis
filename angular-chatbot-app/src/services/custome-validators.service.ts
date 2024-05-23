import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidators {
 static emailValidator(control: FormControl) {
  const email = control.value;
  const re = new RegExp(/^([a-zA-Z0-9]{1,}([a-zA-Z0-9!#$%&'*+-/=?^_{}`|~<>:",\(\)\[\]©]){0,})\@([a-zA-Z0-9\-]+[.]){1,2}([a-zA-Z]{2,6})$/);
  if (email) {
    if (email.length > 50) {
      return {
        maxlength: true
      };
    } else if (!re.test(email)) {
      return {
        pattern: true
      };
    }
  }
  return null;
}
}

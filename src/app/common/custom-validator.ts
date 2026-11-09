import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";


export class CustomValidator {

     public static isValidPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

          if (!control.value) {
               return null;
          }

          const validCharacters = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

          if (control.value.length < 8) {
               return { invalidPasswordLength: true };
          }

          if (validCharacters.test(control.value) === false) {
               return { invalidCharacters: true };
          }

          return null;
     }

     public static isPasswordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

          const pwd1 = control.get('password')?.value;
          const pwd2 = control.get('confirmPassword')?.value;

          if (pwd1 !== pwd2) {
               return { passwordMismatch: true };
          }

          return null;
     }

}
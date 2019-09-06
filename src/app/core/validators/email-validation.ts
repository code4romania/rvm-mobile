import { AbstractControl } from '@angular/forms';

export class EmailValidation {

    /**
     * Email validator
     * @param abstractControl An abstract control reference, to automatically take the value from the input
     * that is being validated
     * @returns null if the string respects the pattern, an error message otherwise
     */
    static emailValidation(abstractControl: AbstractControl): any {
        const email = abstractControl.value;
        const reg = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');

        if (reg.test(email)) {
            return null;
        }

        return { 'email': 'Adresa de email introdusă nu este validă (ex: email@email.com).' };
    }
}

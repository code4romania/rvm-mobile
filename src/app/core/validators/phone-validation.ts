import { AbstractControl } from '@angular/forms';

/**
 * Validator class for the phone number input field
 */
export class PhoneValidation {

    /**
     * Phone validator
     * @param abstractControl An abstract control reference, to automatically take the value from the input
     * that is being validated
     * @returns null if the string respects the pattern, an error message otherwise
     */
    static phoneValidation(abstractControl: AbstractControl): any {
        const phone = abstractControl.value;
        const reg = new RegExp('^[+]{0,1}[0-9]+$');

        if ((reg.test(phone) && phone.length >= 10)) {
            if (phone.length === 12 && phone.indexOf('+') >= 0) {
                return null;
            }

            if (phone.length === 10 && phone.indexOf('+') < 0) {
                return null;
            }
        }

        return { 'phone': 'Numărul de telefon introdus nu este valid (ex: +40722446688, 0733557799).' };
    }
}

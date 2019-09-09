import {AbstractControl} from '@angular/forms';

/**
 * Validator class for password inputs
 * Validates both matching passwords for password reset (password, confirmPassword)
 * and simple password fields
 */
export class PasswordValidation {

    /**
     * Matching passwords validator
     * @param abstractControl An abstract control reference, to automatically take the values from the inputs
     * that are being validated
     * @returns null if the strings match, an error message otherwise
     */
    static MatchPassword(abstractControl: AbstractControl): any {
        const password = abstractControl.get('password').value;
        const confirmPassword = abstractControl.get('confirmPassword').value;

        if (password !== confirmPassword) {
            abstractControl.get('confirmPassword').setErrors({
                password: 'Parolele trebuie să corespundă și să conțină minim 8 caractere, o literă mare, un număr și un caracter special.'
            });
        } else {
            return null;
        }
    }

    /**
     * Password validator
     * @param abstractControl An abstract control reference, to automatically take the value from the input
     * that is being validated
     * @returns null if the string respects the pattern, an error message otherwise
     */
    static passwordValidation(abstractControl: AbstractControl): any {
        const number = new RegExp('\\d');
        const password = abstractControl.value;
        const uppercase = new RegExp('[A-Z]');
        const lowercase = new RegExp('[a-z]');
        const special = new RegExp(/[!#$%&\‘\(\)\*?@\[\]^_\+\.`\{\|\}~]/);

        if (!number.test(password)) {
            return {
                password: 'Parolele trebuie să corespundă și să conțină minim 8 caractere, o literă mare, un număr și un caracter special.'
            };
        }

        if (!uppercase.test(password)) {
            return {
                password: 'Parolele trebuie să corespundă și să conțină minim 8 caractere, o literă mare, un număr și un caracter special.'
            };
        }

        if (!lowercase.test(password)) {
            return {
                password: 'Parolele trebuie să corespundă și să conțină minim 8 caractere, o literă mare, un număr și un caracter special.'
            };
        }

        if (!special.test(password)) {
            return {
                password: 'Parolele trebuie să corespundă și să conțină minim 8 caractere, o literă mare, un număr și un caracter special.'
            };
        }

        if (password.length < 8) {
            return {
                password: 'Parolele trebuie să corespundă și să conțină minim 8 caractere, o literă mare, un număr și un caracter special.'
            };
        }

        return null;
    }
}

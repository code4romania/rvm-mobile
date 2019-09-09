import { AbstractControl } from '@angular/forms';

/**
 * Validator class for the SSN field (CNP)
 */
export class SsnValidation {

    /**
     * Ssn validator
     * @param abstractControl An abstract control reference, to automatically take the value from the input
     * that is being validated
     * @returns null if the string respects the pattern, an error message otherwise
     */
    static ssnValidation(abstractControl: AbstractControl): any {
        const ssn = parseInt(abstractControl.value, 10) || 0;

        if (ssn.toString().length === 13) {
            const cnp = Array.from(String(ssn), Number);
            const coefs = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
            const idx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const s = idx.map((x) => coefs[x] * cnp[x]);
            const res = s.reduce((a, b) => a + b, 0) % 11;

            if ((res < 10 && res === cnp[12]) || (res === 10 && cnp[12] === 1) ) {
                return null;
            } else {
                return {'ssn': 'CNP-ul introdus nu este valid.'};
            }

        } else {
            return {'ssn': 'CNP-ul introdus nu este valid.'};
        }
    }
}

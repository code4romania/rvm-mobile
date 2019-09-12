import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core';
import { EmailValidation } from 'src/app/core/validators/email-validation';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})

/**
 * Component for the recover password functionality
 */
export class RecoverPasswordComponent implements OnInit {
    /**
     * Form reference
     */
    resetPasswordForm: FormGroup;

    /**
     * Error message that will be displayed
     */
    errorMessage: string = null;

    /**
     * Page is loading or not
     */
    loading = false;

    /**
     * Class constructor
     *
     * @param router Provider for router navigation
     * @param authenticationService Injected reference for AuthenticationService
     * @param toastController Controller for toast messages display
     */
    constructor(private router: Router,
                private authenticationService: AuthenticationService,
                private toastController: ToastController) { }

    /**
     * Page initialisation
     */
    ngOnInit() {
        this.resetPasswordForm = new FormGroup({
        email: new FormControl('', [Validators.required, EmailValidation.emailValidation])
        });
    }

    /**
     * Sends the recover password request
     */
    resetPassword() {
        this.loading = true;
        this.authenticationService.recoverPassword(this.resetPasswordForm.value.email).subscribe(response => {
            this.loading = false;
            this.presentToast('Cererea a fost înregistrată. Vă rugăm verificați atât în inbox cât și în spam.');
            this.router.navigate(['/auth/login']);
        }, error => {
            this.loading = false;
            this.errorMessage = 'Adresa de email specificată nu există. Te rugăm să verifici și să încerci din nou.';
            setTimeout(() => {
                this.errorMessage = null;
            }, 3000);
        });
    }

     /**
      * Presents a toast that will be automatically dismessed after 3 seconds
      * @param message toast message
      */
    async presentToast(message: string) {
        const toast = await this.toastController.create({
          message,
          position: 'bottom',
          duration: 3000
        });
        toast.present();
    }
}

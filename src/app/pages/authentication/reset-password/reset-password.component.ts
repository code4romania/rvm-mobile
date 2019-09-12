import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core';
import { PasswordValidation } from 'src/app/core/validators/password-validation';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})

/**
 * Component for the reset password functionality
 */
export class ResetPasswordComponent implements OnInit {
    /**
     * Form reference
     */
     resetPasswordForm: FormGroup;

     /**
      * Token for password reset
      */
    token: string;

    /**
     * Error message that will be displayed
     */
    errorMessage: string;

    /**
     * Page is loading or not
     */
    loading = false;


    /**
     * @param router Provider for router navigation
     * @param authenticationService Injected reference for AuthenticationService
     * @param formBuilder FormBuilder reference, used in creating rective forms
     * @param route Provider for current route
     * @param toastController Controller for toast messages display
     */
    constructor(public router: Router,
                private authenticationService: AuthenticationService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private toastController: ToastController) { }

    /**
     * Page initialisation
     * If user is already logged in when page is accessed, then a logout is performed
     */
    ngOnInit() {
        if (this.authenticationService.isAuthenticated() ) {
            this.authenticationService.logout().subscribe(response => {
                this.initialiseView();
            });
        } else {
            this.initialiseView();
        }

        this.resetPasswordForm = this.formBuilder.group({
            password: ['', [Validators.required,
                PasswordValidation.passwordValidation
            ]],
            confirmPassword: ['', [Validators.required,
                PasswordValidation.passwordValidation
            ]],
            }, {
                validator: PasswordValidation.MatchPassword
            });
    }

    /**
     * Page initialisation after user was logged out (if neccessary)
     */
    initialiseView() {
        this.route.params.subscribe(
            (params) => {
                this.token = params['token'];
            }
        );
    }

    /**
     * Sends the reset password request
     */
    resetPassword() {
        this.loading = true;
        this.authenticationService.resetPassword(this.resetPasswordForm.value.password, this.token).subscribe(response => {
                this.presentToast('Parolă resetată cu succes.');
                this.loading = false;
                this.router.navigate(['/auth/login']);
            }, error => {
                this.loading = false;
                this.setErrorMessage('A apărut o eroare. Vă rugăm reîncercați.');
            });
    }

    /**
     * Changes the value of the error message and clears it after 3 seconds
     * @param message error message that will be displayed
     */
    setErrorMessage(message: string) {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = null;
        }, 3000);
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

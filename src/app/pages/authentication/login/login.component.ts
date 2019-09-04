import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core';
import { EmailValidation } from 'src/app/core/validators/email-validation';
import { PasswordValidation } from 'src/app/core/validators/password-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  loading = false;

  /**
   *
   * @param router Provider for route navigation
   * @param formBuilder Provider for reactive form creation
   * @param authenticationService Provider for authentication related operation
   */
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService) { }

  /**
   * Page initialisation
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * Form initialisation
   */
  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, EmailValidation.emailValidation]],
      password: ['', [Validators.required, PasswordValidation.passwordValidation]]
    });
  }

  /**
   * Authentication credentials from the form are sent to the authentication service for validation
   * If they are validated, the user will be redirected to the home page, if not, a toast will display an error message
   */
  submit() {
    this.loading = true;
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
        })
      )
      .subscribe(
        (credentials) => {
            this.loading = false;
            this.router.navigate(['../home'], {
              replaceUrl: true
            });
        },
        (error: any) => {
          this.loading = false;
          this.errorMessage = 'Informații incorecte';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      );
  }

  /**
   * Ionic lifecycle method, in this case the default back navigation is blocked (android)
   */
  ionViewDidEnter() {
    document.addEventListener('backbutton', (e) => { }, false);
  }
}

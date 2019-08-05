import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { DatabaseSyncService, AuthenticationService } from 'src/app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  /**
   * 
  * @param router Provider for route navigation
   * @param formBuilder Provider for reactive form creation
   * @param authenticationService Provider for authentication related operation
   * @param databaseSyncService Provider for database synchronization
   * @param location Provider for location changes
   * @param toastController Controller for toast messages display
   */
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private databaseSyncService: DatabaseSyncService,
    private location: Location,
    private toastController: ToastController) { }

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Authentication credentials from the form are sent to the authentication service for validation
   * If they are validated, the user will be redirected to the home page, if not, a toast will display an error message
   */
  submit() {
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
        })
      )
      .subscribe(
        (credentials) => {
          this.router.navigate(['../home'], {
            replaceUrl: true
          });
          this.databaseSyncService.sync();
          this.location.replaceState(this.router.serializeUrl(this.router.createUrlTree(['home'])));
        },
        (error: any) => {
          this.presentToastWithOptions();
        }
      );
  }

  /**
    * Ionic lifecycle method, in this case the default back navigation is blocked (android)
    */
  ionViewDidEnter() {
    document.addEventListener("backbutton", function (e) {
    }, false);
  }

  /**
   * Presents a toast with an error message if the credentials are incorrect
   */
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'Informații incorecte',
      position: 'bottom',
      buttons: [
        {
          text: 'Reîncearcă',
          side: 'end',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    toast.present();
  }
}

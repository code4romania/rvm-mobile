import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/authentication';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {finalize} from 'rxjs/operators';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private location: Location,
              private toastController: ToastController) { }
              
  ngOnInit() {
    this.createForm();
  }

  submit() {
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
        })
      )
      .subscribe(
        (credentials: Authentication.Credentials) => {
          this.router.navigate(['../home'], {
            replaceUrl: true
          });
          this.location.replaceState(this.router.serializeUrl(this.router.createUrlTree(['home'])));
        },
        (error: any) => {
          this.presentToastWithOptions();
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ionViewDidEnter() {
    document.addEventListener("backbutton",function(e) {
      // prevent back navigation to authenticated state
    }, false);
  }

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

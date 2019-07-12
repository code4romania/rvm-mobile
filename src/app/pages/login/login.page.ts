import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/authentication';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.createForm();
  }

  submit() {
    // this.authenticationService
    //   .login(this.loginForm.value)
    //   .pipe(
    //     finalize(() => {
    //       this.loginForm.markAsPristine();
    //     })
    //   )
    //   .subscribe(
    //     (credentials: Authentication.Credentials) => {
    //       console.log(credentials);
    //       this.router.navigate(['../home'], {
    //         replaceUrl: true
    //       });
    //     },
    //     (error: any) => {
    //       console.log(`Login error: ${error}`);
    //     }
    //   );
    // TODO UNCOMMENT THIS WHEN BACKEND READY

    if (this.loginForm.valid) {
      this.router.navigate(['../home'], {
        replaceUrl: true
      });
    }
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      phoneNumer: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      securityCode: ['', Validators.required]
    });
  }
}

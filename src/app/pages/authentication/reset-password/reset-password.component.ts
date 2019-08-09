import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core';
import { PasswordValidation } from 'src/app/core/validators/password-validation';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
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
	* 
	* @param router Provider for router navigation
   	* @param authenticationService Injected reference for AuthenticationService
	* @param formBuilder FormBuilder reference, used in creating rective forms
	* @param route Provider for current route
	*/
	constructor(public router: Router,
		private authenticationService: AuthenticationService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute) { }

	/**
  	* Page initialisation
  	*/
	ngOnInit() {
		this.route.params.subscribe(
			(params) => {
				this.token = params['token'];
			}
    	);
    
		this.resetPasswordForm = this.formBuilder.group({
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
			}, {
				validator: PasswordValidation.MatchPassword
			});
	}

	/**
	 * Sends the reset password request
	 */
	resetPassword() {
		// TODO handles this when backend ready
		this.authenticationService.resetPassword(this.resetPasswordForm.value.password, this.token).subscribe(response => {
			console.log(response);
			this.router.navigate(['/auth/login']);
		});
	}
}
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core';


@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
	/**
	 * Form reference
	 */
  	resetPasswordForm: FormGroup;

	/**
   	* Class constructor
   	* 
   	* @param router Provider for router navigation
   	* @param authenticationService Injected reference for AuthenticationService
   	*/
	constructor(private router: Router,
		private authenticationService: AuthenticationService) { }

	/**
  	* Page initialisation
  	*/
	ngOnInit() {
		this.resetPasswordForm = new FormGroup({
			email: new FormControl('', [Validators.required])
		});
	}

	/**
	 * Sends the recover password request
	 */
	resetPassword() {
		// TODO handles this when backend ready
		this.authenticationService.recoverPassword(this.resetPasswordForm.value.email).subscribe(response => {
			console.log(response);
			this.router.navigate(['/auth/login']);
		});
	}
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  /**
   *
   * @param authenticationService Provider for authentication related operations
   * @param router Provider for router navigation
   */
  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  /**
   * A request through the authentication service is sent for logout;
   * If its successful the user will be redirected to the login screen
   */
  ngOnInit() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['../auth/login'], {
        replaceUrl: true
      });
    });
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(): boolean {
    // if (this.authenticationService.isAuthenticated()) {
    //   return true;
    // }

    // this.router.navigate(['/login'], {
    //   replaceUrl: true
    // });
    // return false;

    // TODO UNCOMMENT THIS WHEN BACKEND READY
    return true;
  }
}

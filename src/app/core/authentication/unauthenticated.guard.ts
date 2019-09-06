import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

/**
 * Provides a guard for protecting unauthenticated routes (such as login)
 */
@Injectable()
export class UnauthenticatedGuard implements CanActivate {

   /**
    * Class constructor
    * @param router Angular value which handles routing operations
    * @param authenticationService The service which handles the authentication operations
    */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

   /**
    * Determines if a user can access a route, depending on its state
    * If the route isn't allowed, it automatically redirects to home page
    * @returns a boolean value, current user's status: unauthenticated or authenticated
    */
  canActivate(): boolean {
    if (!this.authenticationService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/home'], {
      replaceUrl: true
    });
    return false;
  }
}

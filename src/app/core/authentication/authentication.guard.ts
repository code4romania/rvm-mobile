import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

/**
 * Provides a guard for protecting authenticated routes (such as home, validate-volunteer)
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * Class constructor
   * 
   * @param router Angular value which handles routing operations
   * @param authenticationService The service which handles the authentication operations
   */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  /**
   * Determines if a user can access a route, depending on its state
   * If the route isn't allowed, it automatically redirects to login page
   * 
   * @returns a boolean value, current user's status: authenticated or not
   */
  canActivate(): boolean {
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth/login'], {
      replaceUrl: true
    });
    return false;
  }
}

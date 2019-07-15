import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class UnauthenticatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

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

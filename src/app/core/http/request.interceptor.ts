import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../authentication/authentication.service';

/**
 * Prefixes all requests with `environment.serverUrl` and adds the authentication token to requests
 */
@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  /**
   * Class constructor
   * @param authenticationService Injected service referes the AuthenticationService for handling authentication related operations
   */
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * Intercepts all requests that are sent and adds extra information to them
   * @param request The current request that is being sent
   * @param next Handles the next state of the request
   * @returns The new request, with the additional information
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${this.authenticationService.accessToken}`,
      }
    });

    return next.handle(request);
  }
}

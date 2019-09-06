import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorMessageService } from '../service/error-message.service';
import { environment } from '../../../environments/environment';

/**
 * Key that identifies the credentials
 */
const credentialsKey = 'credentials';

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  /**
   * Class constructor
   * @param router Angular value which handles routing operations
   * @param localStorageService Injected service referes the LocalStorageService for handling operations related to storage
   * @param errorMessageService Injected service referes the ErrorMessageService for handling operations related to error messagging
   */
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private errorMessageService: ErrorMessageService
  ) {}

   /**
    * Intercepts all requests that are sent and adds an error handling function to them
    * @param request The current request that is being sent
    * @param next Handles the next state of the request
    * @returns An observable with the new request, with the additional information
    */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError(error => this.errorHandler(error)));
  }

  /**
   * Handles the request errors depending on its code
   * @param response Request response
   * @returns An observable with the http event
   */
  private errorHandler(
    response: HttpResponse<any>
  ): Observable<HttpEvent<any>> {
    if (response.status === 401) {
      this.localStorageService.clearItem(credentialsKey);
      this.router.navigate(['/auth/login'], {
        replaceUrl: true
      });
    } else if (response.status === 400) {
      const errorResponse: any = response;
      if (errorResponse.error) {
        if (errorResponse.error.validation) {
          errorResponse.error.validation.keys.forEach((key: string) => {
            this.errorMessageService.set(
              errorResponse.error.validation.errors[key],
              key,
              response.url
            );
          });
        } else {
          this.errorMessageService.set(
            errorResponse.error.error,
            '_GLOBAL_',
            response.url
          );
        }
      }
    }

    if (!environment.production) {
      console.error('Request error', response);
    }
    throw response;
  }
}

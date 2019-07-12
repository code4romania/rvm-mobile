import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

/**
 * Prefixes all requests with `environment.apiUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if(!request.url.includes('assets')) {
      request = request.clone({
        url: environment.apiUrl + request.url
      });
    }

    return next.handle(request);
  }
}

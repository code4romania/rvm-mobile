import { CommonModule } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import {
  AuthenticationGuard,
  AuthenticationService,
} from './authentication';
import {
  ApiPrefixInterceptor,
  ErrorHandlerInterceptor,
  HttpService
} from './http';
import { LocalStorageService } from './local-storage.service';
import { RouteReusableStrategy } from './route-reusable-strategy';
import {
  ErrorMessageService,
  UserService,
  UtilService,
  CourseService,
  VolunteerService,
  OrganizationService
} from './service';
import { LocationsService } from './service/locations.service';
import { UnauthenticatedGuard } from './authentication/unauthenticated.guard';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule],
  declarations: [],
  providers: [
    LocalStorageService,
    AuthenticationService,
    AuthenticationGuard,
    UnauthenticatedGuard,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    UserService,
    VolunteerService,
    UtilService,
    ErrorMessageService,
    LocationsService,
    CourseService,
    OrganizationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    },
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ]
})
export class CoreModule {}

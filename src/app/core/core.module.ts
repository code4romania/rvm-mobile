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
  RequestInterceptor,
  ErrorHandlerInterceptor
} from './http';
import { LocalStorageService } from './local-storage.service';
import { RouteReusableStrategy } from './route-reusable-strategy';
import {
  ErrorMessageService,
  CourseService,
  VolunteerService,
  OrganisationService
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
    RequestInterceptor,
    ErrorHandlerInterceptor,
    VolunteerService,
    ErrorMessageService,
    LocationsService,
    CourseService,
    OrganisationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ]
})

/**
 * Module for all core related services, interceptors and models
 */
export class CoreModule {}

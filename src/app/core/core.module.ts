import { CommonModule } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
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
  OrganisationService,
  DatabaseSyncService,
  AllocationService
} from './service';
import { StaticsService } from './service/statics.service';
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
    StaticsService,
    CourseService,
    OrganisationService,
    DatabaseSyncService,
    AllocationService,
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

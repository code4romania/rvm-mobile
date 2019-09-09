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
import { CustomSelectorComponent } from './components/custom-selector/custom-selector.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    IonicModule,
    FormsModule
  ],
  declarations: [
    CustomSelectorComponent
  ],
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
  ],
  entryComponents: [
    CustomSelectorComponent
  ]
})

/**
 * Module for all core related services, interceptors and models
 */
export class CoreModule {}

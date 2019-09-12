import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthenticationPage } from './authentication.page';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UnauthenticatedGuard } from 'src/app/core/authentication/unauthenticated.guard';

/**
 * All routes that are derivated from '/auth' and linked to authentication components
 */
const routes: Routes = [
  {
    path: '',
    component: AuthenticationPage,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'reset/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'recover',
    component: RecoverPasswordComponent,
    canActivate: [UnauthenticatedGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AuthenticationPage,
    ResetPasswordComponent,
    RecoverPasswordComponent,
    LoginComponent,
    LogoutComponent
  ]
})
/**
 * Authentication components module, loads all the auth components when it is loaded
 */
export class AuthenticationPageModule {}

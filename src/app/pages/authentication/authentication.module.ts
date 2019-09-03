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
export class AuthenticationPageModule {}

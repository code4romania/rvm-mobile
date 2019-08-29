import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VolunteerPage } from './volunteer.page';
import { AddVolunteerComponent } from './add-volunteer/add-volunteer.component';
import { ListVolunteerComponent } from './list-volunteer/list-volunteer.component';
import { ValidateVolunteerComponent } from './validate-volunteer/validate-volunteer.component';
import { AuthenticationGuard } from '../../core/authentication/authentication.guard';
import { SendMessageComponent } from './send-message/send-message.component';

const routes: Routes = [
  {
    path: '',
    component: VolunteerPage,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'add',
    component: AddVolunteerComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'list',
    component: ListVolunteerComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'validate',
    component: ValidateVolunteerComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'send',
    component: SendMessageComponent,
    canActivate: [AuthenticationGuard]
  }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    VolunteerPage,
    AddVolunteerComponent,
    ListVolunteerComponent,
    ValidateVolunteerComponent,
    SendMessageComponent
  ]
})
export class VolunteerPageModule {}

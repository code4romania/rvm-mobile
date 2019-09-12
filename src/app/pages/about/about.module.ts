import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AboutPage } from './about.page';
import { AuthenticationGuard } from '../../core/authentication/authentication.guard';

/**
 * List of all routes that are derivate from '/about'
 */
const routes: Routes = [
  {
    path: '',
    component: AboutPage,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AboutPage]
})

/**
 * Module that loads the components derived from the 'about' section
 */
export class AboutPageModule {}

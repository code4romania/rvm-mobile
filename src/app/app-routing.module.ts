import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core';

/**
 * List of all parent routes accessible from the '' route and their respective modules
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'about',
    loadChildren: './pages/about/about.module#AboutPageModule',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'volunteer',
    loadChildren: './pages/volunteer/volunteer.module#VolunteerPageModule',
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'auth',
    loadChildren: './pages/authentication/authentication.module#AuthenticationPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

/**
 * Main app module, lazy loads all parent routes
 */
export class AppRoutingModule {}

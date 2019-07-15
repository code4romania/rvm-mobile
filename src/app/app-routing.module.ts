import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core';
import { UnauthenticatedGuard } from './core/authentication/unauthenticated.guard';

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
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
    canActivate: [UnauthenticatedGuard]
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
    path: 'logout', 
    loadChildren: './pages/logout/logout.module#LogoutPageModule',
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

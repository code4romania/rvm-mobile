import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { IonRouterOutlet, Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService, LocalStorageService, DatabaseSyncService } from './core';
import { Router } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks';
import { ResetPasswordComponent } from './pages/authentication/reset-password/reset-password.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit {
  /**
   * Router outlet reference
   */
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  /**
   * Boolean value that shows/hides the side menu depending on user's state
   */
  showSideMenu = true;

  /**
   * Side menu navigation pages (page name and page url)
   */
  public appPages = [
    {
      title: 'Despre Aplicație',
      url: '/about'
    },
    {
      title: 'Validează un voluntar',
      url: '/volunteer/validate'
    },
    {
      title: 'Adaugă voluntar nou',
      url: '/volunteer/add'
    },
    {
      title: 'Vezi toți voluntarii',
      url: '/volunteer/list'
    },
    {
      title: 'Apelează suport',
      url: 'tel:89992142265'
    },
    {
      title: 'Delogare',
      url: '/auth/logout'
    }
  ];

  /**
   *
   * @param platform Provider for cordova platforms
   * @param splashScreen Provider for splash screen
   * @param statusBar Provider for status bar
   * @param authenticationService Provider for authentication related operations
   * @param router Provider for route navigation
   * @param localStorageService Provider for localStorage related operations
   * @param databaseSyncService Provider for database synchronization
   */
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authenticationService: AuthenticationService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private databaseSyncService: DatabaseSyncService) {
    this.initializeApp();
  }

  /**
   * Application initialisation
   * If cordova is available then the splash screen is hidden and status bar style is set
   */
  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.backgroundColorByHexString('#264998');
        this.statusBar.styleDefault();

        if (!this.localStorageService.getItem('firstLaunch')) {
          this.databaseSyncService.sync().then(response => {
            this.splashScreen.hide();
            this.localStorageService.setItem('firstLaunch', false);
           });
        } else {
          this.splashScreen.hide();
        }
      }
    });
  }

  /**
   *
   * @param url Contains the value of the next application state
   */
  performAction(url: string) {
    if (url.includes('tel')) {
      window.open(url);
    } else {
      this.router.navigate([url]);
    }
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        Deeplinks.route({
          '/auth/reset/:token': ResetPasswordComponent
        }).subscribe((match) => {
          setTimeout(() => {
            this.router.navigate(['/auth/reset/', match.$args.token]);
          }, 1000);
        }, (nomatch) => {
          console.warn('Unmatched Route', nomatch);
        });
      }
    });
  }
}

import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService, LocalStorageService, DatabaseSyncService } from './core';
import { Router } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks';
import { ResetPasswordComponent } from './pages/authentication/reset-password/reset-password.component';
import { Location } from '@angular/common';

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
   * Stores the current state of back-button tapping: tapped once or twice (for exiting app)
   */
  private isDoubleTap = false;

  /**
   *
   * @param platform Provider for cordova platforms
   * @param splashScreen Provider for splash screen
   * @param statusBar Provider for status bar
   * @param authenticationService Provider for authentication related operations
   * @param router Provider for route navigation
   * @param localStorageService Provider for localStorage related operations
   * @param location Provider for route location change
   * @param databaseSyncService Provider for database synchronization
   * @param toastCtrl Controller for toast management
   */
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authenticationService: AuthenticationService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private location: Location,
    private databaseSyncService: DatabaseSyncService,
    private toastCtrl: ToastController) {
    this.initializeApp();
  }

  /**
   * Application initialisation
   * If cordova is available then the splash screen is hidden and status bar style is set
   * The back-button subscription is set (if the current route is login/home 
   * then it closes the app completely on double tap within 3 seconds)
   */
  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.backgroundColorByHexString('#264998');
        this.statusBar.styleDefault();

        document.addEventListener('backbutton', (event) => {
          const currentPath = this.router.url;
          if (currentPath.indexOf('login') >= 0 || currentPath.indexOf('home') >= 0) {
            if (!this.isDoubleTap) {
              this.isDoubleTap = true;
              this.presentToast();

              setTimeout(() => {
                this.isDoubleTap = false;
               }, 3000);
            } else {
              navigator['app'].exitApp();
            }
          } else {
            this.location.back();
          }
        }, false);

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

  /**
   * Angular lifecycle method; gets triggered after view initialisation
   */
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

  /**
   * Presents a toast that will be automatically dismessed after 3 seconds
   */
  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Apăsați din nou pentru a părăsi aplicația.',
      position: 'bottom',
      duration: 3000
    });

    toast.present();
  }
}

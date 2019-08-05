import { Component, ViewChild } from '@angular/core';

import { IonRouterOutlet, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './core';
import { Router } from '@angular/router';
import { AboutPage } from './pages/about/about.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
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
   */
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authenticationService: AuthenticationService,
    private router: Router) {
    this.initializeApp();
  }

  /**
   * Application initialisation
   * If cordova is available then the splash screen is hidden and status bar style is set
   */
  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')){
        this.statusBar.backgroundColorByHexString('#264998');
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });
  }

  /**
   * 
   * @param url Contains the value of the next application state
   */
  performAction(url: string) {
    if(url.includes('tel')) {
      window.open(url);
    } else {
      this.router.navigate([url]);
    }
  }

  ngAfterViewInit() {
    // this.platform.ready().then(() => {
    //   window['IonicDeeplink'].route({
    //     '/about': AboutPage
    //   }).subscribe((match) => {
    //     // match.$route - the route we matched, which is the matched entry from the arguments to route()
    //     // match.$args - the args passed in the link
    //     // match.$link - the full link data
    //     console.log('Successfully matched route', match);
    //   },
    //   (nomatch) => {
    //     // nomatch.$link - the full link data
    //     console.error('Got a deeplink that didn\'t match', nomatch);
    //   });
    // });
    
  }
}

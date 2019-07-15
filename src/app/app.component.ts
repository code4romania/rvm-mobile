import { Component, ViewChild } from '@angular/core';

import { IonRouterOutlet, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  showSideMenu = true;
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
      url: '/logout'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authenticationService: AuthenticationService,
    private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')){
        this.statusBar.backgroundColorByHexString('#264998');
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });
  }

  performAction(url) {
    if(url.includes('tel')) {
      window.open(url);
    } else {
      this.router.navigate([url]);
    }
  }
}

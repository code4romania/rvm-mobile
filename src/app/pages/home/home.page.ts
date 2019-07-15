import { Component,   } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  doubleClick = false;
  actions = [
    {
      title: 'Validează voluntar',
      url: '/volunteer/validate'
    }, {
      title: 'Adaugă voluntar nou',
      url: '/volunteer/add'
    }, {
      title: 'Vezi toți voluntarii',
      url: '/volunteer/list'
    }, {
      title: 'Apelează suport',
      url: 'tel:89992142265'
    }
  ];

  constructor(private router: Router,
              private toastController: ToastController) { }

  performAction(url) {
    if(url.includes('tel')) {
      window.open(url);
    } else {
      this.router.navigate([url]);
    }
  }
  
  ionViewDidEnter() {
    document.addEventListener("backbutton",function(e) {
      // prevent back navigation to unauthenticated state
    }, false);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Apasă din nou pentru a părăsi aplicația',
      position: 'bottom',
      duration: 1000     
    });
    toast.present();
  }
}

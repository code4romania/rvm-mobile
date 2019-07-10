import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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

  constructor(private router: Router) {}

  performAction(url) {
    if(url.includes('tel')) {
      window.open(url);
    } else {
      this.router.navigate([url]);
    }
  }
}

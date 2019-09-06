import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /**
   * Actions that can be performed from the side-menu
   */
  actions = [
    {
      title: 'Validează voluntar',
      url: '/volunteer/validate'
    }, {
      title: 'Adaugă voluntar',
      url: '/volunteer/add'
    }, {
      title: 'Vezi toți voluntarii',
      url: '/volunteer/list'
    }, {
      title: 'Apelează suport',
      url: 'tel:89992142265'
    }
  ];

  /**
   *
   * @param router Provider for route navigation
   */
  constructor(private router: Router) { }

  /**
   * Performes the action selected by the user from the side-menu list;
   * It can either mean navigation to a new page or opening the phone's call screen
   * @param url String containing the url for the route that will be displayed on user click
   */
  performAction(url: string) {
    if (url.includes('tel')) {
      window.open(url);
    } else {
      this.router.navigate([url]);
    }
  }
}

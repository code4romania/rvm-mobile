import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private authenticationService: AuthenticationService, 
              private router: Router) { }

  ngOnInit() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['../login'], {
        replaceUrl: true
      });
    });
  }

}

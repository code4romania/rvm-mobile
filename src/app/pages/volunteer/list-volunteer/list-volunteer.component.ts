import { Component, ViewChild,OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { UserService } from '../../../core/service/user.service';
import { LocationsService } from 'src/app/core/service/locations.service';

@Component({
  selector: 'app-list-volunteer',
  templateUrl: './list-volunteer.component.html',
  styleUrls: ['./list-volunteer.component.scss'],
})
export class ListVolunteerComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  users = [];
  counties = [];
  organizations = [];
  specializations = [];

  keyword = '';
  userIdWithDetails: string;
  selectedCounty: string;
  selectedOrganization: string;
  selectedSpecialization: string;
  
  page = 0;
  limit = 10;

  constructor(private userService: UserService,
              private locationsService: LocationsService) { }

  ngOnInit() {
    this.getData();

    this.getCountyList();   
    this.getOrganizations();
    this.getSpecializations();
  }

  openMenu(userId) {
    if(this.userIdWithDetails === userId){
      this.userIdWithDetails = null;
    } else{
      this.userIdWithDetails = userId;
    }
  }

  allocateUser(userId) {
    const index = this.users.findIndex(user => user._id === userId);
    if (index >= 0) {
      this.users[index].allocated = true;
    }
  }

  sendAlert() {
    console.log('Alert sent');
  }

  getCountyList() {
    this.locationsService.getCountyList().subscribe((response) => {
      this.counties = response;
    });
  }

  getOrganizations() {
    this.organizations.push({
      id:'1',
      name:'Crucea Roșie'
    });
    
    this.organizations.push({id: '2',
    name: 'Habitat for Humanity'
    });
  }

  getSpecializations() {
    this.specializations.push({
      id:'1',
      name:'prim ajutor'
    });

    this.specializations.push({id: '2',
    name: 'constructii'
    });
  }

  selectionsChanged() {
    this.getData();
  }

  getData() {
    if(this.page === 0) {
      this.users = [];
    }

    if(this.selectedCounty || this.selectedOrganization || this.selectedSpecialization) {
      this.userService.filter(this.selectedCounty, this.selectedOrganization, this.selectedSpecialization , this.page, this.limit , (response) => {
        this.users = response;
      });
    } else {
      this.userService.getUsers(this.page, this.limit, (response) => {
        response.forEach(user => this.users.push(user));
      });
    }
  }

  loadData(event) {
    setTimeout(() => {
      this.page++;
      this.getData();
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.users.length == 20) {
        event.target.disabled = true;
      }
    }, 500);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.page = 0;
      this.getData();
      event.target.complete();
    }, 1000);
  }
}

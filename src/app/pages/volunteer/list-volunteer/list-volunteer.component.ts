import { Component, ViewChild,OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { VolunteerService } from '../../../core/service/volunteer.service';
import { LocationsService } from 'src/app/core/service/locations.service';
import { isArray } from 'util';
import { OrganizationService, CourseService } from 'src/app/core';

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
  courses = [];

  keyword = '';
  userIdWithDetails: string;
  selectedCounty = 'all';
  selectedOrganization: string;
  selectedSpecialization: string;
  
  page = 0;
  limit = 10;

  constructor(private volunteerService: VolunteerService,
              private locationsService: LocationsService,
              private organizationService: OrganizationService,
              private courseService: CourseService) { }

  ngOnInit() {
    this.getData();

    this.getCountyList();   
    this.getOrganizations();
    this.getCourses();
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
    this.organizationService.getOrganizations((result) => {
      result.forEach(row => {
        this.organizations.push(row.doc);
      });
    });
  }

  getCourses() {
    this.courseService.getCourses((result) => {
      result.forEach(row => {
        this.courses.push(row.doc);
      });
    });
  }

  selectionsChanged() {
    this.getData();
  }

  getData() {
    if(this.page === 0) {
      this.users = [];
    }
 
    if(this.selectedCounty === 'all') {
      this.selectedCounty = '';
    }

    if(this.selectedCounty || this.selectedOrganization || this.selectedSpecialization) {
      this.volunteerService.filter(this.selectedCounty, this.selectedOrganization, this.selectedSpecialization , this.page, this.limit , (response) => {
        this.users = response;
      });
    } else {
      this.volunteerService.getVolunteers(this.page, this.limit, (response) => {
        response.forEach(volunteer => {
          this.users.push(volunteer.doc);
        });   
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

  getOrganizationName(organizationId) {
    // todo update this
    const organization = this.organizations.find(item => item._id === organizationId);
  
    if(organization) {
      return organization.name;
    } else {
      return null;
    }
  }
}

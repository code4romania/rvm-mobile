import { Component, ViewChild,OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { VolunteerService } from '../../../core/service/volunteer.service';
import { LocationsService } from 'src/app/core/service/locations.service';
import { isArray } from 'util';
import { OrganisationService, CourseService } from 'src/app/core';

@Component({
  selector: 'app-list-volunteer',
  templateUrl: './list-volunteer.component.html',
  styleUrls: ['./list-volunteer.component.scss'],
})
export class ListVolunteerComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  volunteers = [];
  counties = [];
  organisations = [];
  courses = [];

  keyword = '';
  volunteerIdWithDetails: string;
  selectedCounty = 'all';
  selectedOrganisation: string;
  selectedCourse: string;
  
  page = 0;
  limit = 10;

  constructor(private volunteerService: VolunteerService,
              private locationsService: LocationsService,
              private organisationService: OrganisationService,
              private courseService: CourseService) { }

  ngOnInit() {
    this.getData();

    this.getCountyList();   
    this.getOrganisations();
    this.getCourses();
  }

  openMenu(volunteerId) {
    if(this.volunteerIdWithDetails === volunteerId){
      this.volunteerIdWithDetails = null;
    } else{
      this.volunteerIdWithDetails = volunteerId;
    }
  }

  allocateUser(volunteerId) {
    const index = this.volunteers.findIndex(volunteer => volunteer._id === volunteerId);
    if (index >= 0) {
      this.volunteers[index].allocated = true;
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

  getOrganisations() {
    this.organisationService.getOrganisations().subscribe((result: any) =>{
      result.rows.forEach(row => {
        this.organisations.push(row.doc);
      });
    });
  }

  getCourses() {
    this.courseService.getCourses().subscribe((response: any) =>{
      const data = response.rows.filter(item => item.doc.language !== 'query');
     
      this.courses = data.map(item => item.doc.name).filter((value, index, self) => self.indexOf(value) === index);
    });
  }

  selectionsChanged() {
    this.page = 0;
    this.getData();
  }

  getData() {
    if(this.page === 0) {
      this.volunteers = [];
    }
    
    if(this.selectedCounty !== 'all' || this.selectedOrganisation || this.selectedCourse) {
      this.volunteerService.filter(this.selectedCounty, this.selectedOrganisation, this.selectedCourse , this.page, this.limit).subscribe((response: any) => {
        // todo replace this
        if(this.selectedCourse) {
          this.volunteers = response.docs.filter(doc => {
            const course = doc.courses.find(course => course.name === this.selectedCourse)
            if(course) {
              return true;
            } else {
              return false;
            }
          });
        } else {
          this.volunteers = response.docs;
        }
      });
    } else {
      this.volunteerService.getVolunteers(this.page, this.limit).subscribe((response: any) => {
        response.rows.forEach(volunteer => {
          this.volunteers.push(volunteer.doc);
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
      if (this.volunteers.length == 20) {
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

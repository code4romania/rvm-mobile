import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { VolunteerService } from '../../../core/service/volunteer.service';
import { LocationsService } from 'src/app/core/service/locations.service';
import { OrganisationService, CourseService, AllocationService } from 'src/app/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavigationExtras, Router } from '@angular/router';
import { Volunteer } from 'src/app/core/model/volunteer.model';

@Component({
  selector: 'app-list-volunteer',
  templateUrl: './list-volunteer.component.html',
  styleUrls: ['./list-volunteer.component.scss'],
})
export class ListVolunteerComponent implements OnInit {
  /**
   * Infinite scroll reference that detects user's swipe to refresh events
   */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  volunteers = [];
  counties = [];
  organisations = [];
  courses = [];
  courseOptions = [];
  cities = [];

  keyword = '';

  /**
   * String that contains the id of the volunteer that currently has the open details
   */
  volunteerIdWithDetails: string;

  selectedCounty: string;
  selectedOrganisation: string;
  selectedCourse: string;

  /**
   * County for allocation
   */
  county: any;
  /**
   * City for allocation
   */
  city: any;

  /**
   * Pagination
   */
  page = 0;
  /**
   * Limit of volunteers per page
   */
  limit = 10;

  /**
   *
   * @param volunteerService Provider for volunteer related operations
   * @param locationsService Provider for location selection
   * @param organisationService Provider for organisation related operations
   * @param courseService Provider for course related operations
   * @param allocationService  Provider for volunteer allocation related operations
   * @param router Provider for route navigation
   * @param iab Provider for accessing an url in browser
   */
  constructor(private volunteerService: VolunteerService,
              private locationsService: LocationsService,
              private organisationService: OrganisationService,
              private courseService: CourseService,
              private allocationService: AllocationService,
              private router: Router,
              private iab: InAppBrowser) { }

  /**
   * Page initialisation
   */
  ngOnInit() {
    this.getData();

    this.getCountyList();
    this.getOrganisations();
    this.getCourseOptions();
  }

  /**
   * Opens a details menu for the selected volunteer and closes all already opened ones
   * @param volunteerId String containing the id of the volunteer that was selected
   */
  openMenu(volunteerId: string) {
    this.courses = [];
    if (this.volunteerIdWithDetails === volunteerId) {
      this.volunteerIdWithDetails = null;
    } else {
      this.volunteerIdWithDetails = volunteerId;
      this.courseService.getCourseByVolunteerId(volunteerId).subscribe(response => {
        this.courses = response.docs;
      });
    }
  }

  /**
   * Retrives the list of courses from the courses service
   */
  getCourseOptions() {
    this.courseOptions = [{
      _id: '1',
      name: 'prim-ajutor'
    }, {
      _id: '2',
      name: 'constructii'
    }];
  }

  /**
   * Opens the allocation menu for the selected user
   * @param volunteerId String containing the id of the volunteer that was selected for allocation
   */
  allocateUser(volunteerId: string) {
    const index = this.volunteers.findIndex(volunteer => volunteer._id === volunteerId);
    if (index >= 0) {
      this.volunteers[index].isInAllocation = true;
    }
  }

  /**
   * Allocate the selected volunteer for a location using the allocation service
   * @param volunteerId String containing the id of the volunteer that was selected for allocation
   */
  confirmAllocation(volunteerId: string) {
    const index = this.volunteers.findIndex(volunteer => volunteer._id === volunteerId);
    delete this.city.county;

    if (index >= 0) {
      this.allocationService.createAllocation(this.volunteers[index], this.county, this.city, this.volunteers[index].organisation)
      .subscribe(() => {
        this.volunteers[index] = this.volunteerService.getVolunteerById(volunteerId).subscribe((response) => {
          if (response.docs && response.docs.length > 0) {
            this.volunteers[index] = response.docs[0];
          }
          this.volunteers[index].isInAllocation = false;
        });
      });
    }
  }

  /**
   * Sends an alert message to the selected volunteer/s
   * @param volunteerId Selected volunteer id, if the message will be sent to only one recipient
   */
  sendAlert(volunteer?: Volunteer) {
    let volunteers = [];
    if (volunteer) {
      volunteers.push(volunteer);
    } else {
      volunteers = this.volunteers;
    }

    const navigationExtras: NavigationExtras = {
      state: {
        volunteers
      }
    };

    this.router.navigateByUrl('/volunteer/send', navigationExtras);
  }

  /**
   * Retrives the list of counties from the locations service
   */
  getCountyList() {
    this.locationsService.getCountyList().subscribe((response) => {
      this.counties = response;
    });
  }

  /**
   * Retrives the list of organisations from the organisations service
   */
  getOrganisations() {
    this.organisationService.getOrganisations().subscribe((result: any) => {
      result.docs.forEach(doc => {
        this.organisations.push(doc);
      });
    });
  }

  /**
   * When a selection is changed, new data is retrived
   */
  selectionsChanged() {
    this.page = 0;
    this.getData();
  }

  /**
   * Retrieves data, filtered by user's selections
   */
  getData() {
    if (this.page === 0) {
      this.volunteers = [];
    }

    if (this.selectedCounty || this.selectedOrganisation || this.selectedCourse) {
      this.volunteerService.filter(this.selectedCounty, this.selectedOrganisation, this.selectedCourse , this.page, this.limit)
      .subscribe((response: any) => {
        this.volunteers = response.docs;
      });
    } else {
      this.volunteerService.getVolunteers(this.page, this.limit).subscribe((response: any) => {
        response.docs.forEach(volunteer => {
          this.volunteers.push(volunteer);
        });
      });
    }
  }

  /**
   * Loads more data, the response is paginated so on scorll down more informations needs to be loaded
   * @param event Scroll event
   */
  loadData(event) {
    setTimeout(() => {
      this.page++;
      this.getData();
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.volunteers.length === 20) {
        event.target.disabled = true;
      }
    }, 500);
  }

  /**
   * Refreshes the data, on scroll up the page is reset
   * @param event Scroll event
   */
  doRefresh(event) {
    setTimeout(() => {
      this.page = 0;
      this.getData();
      event.target.complete();
    }, 1000);
  }

  /**
   * When a county is selected, the form's value is updated and starts retriving the list of cities from that county
   * @param event Changing event, triggered when a change is detected on an element
   */
  countySelectionChanged(event) {
    this.getCityList(event.detail.value);
  }

  /**
   *
   * @param county Retrieves the list of cities from the selected county
   */
  getCityList(county: any) {
    this.locationsService.getCityList().subscribe((response) => {
      this.cities = response.filter(city => city.county === county.name);
    });
  }

  /**
   * Opens a navigation browser with the website url
   * @param website Organisation website url
   */
  openBrowser(website: string) {
    if (website) {
      website = 'http://' + website.replace('http://', '').replace('https://', '');
      this.iab.create(website);
    }
  }
}

import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { VolunteerService } from '../../../core/service/volunteer.service';
import { StaticsService } from 'src/app/core/service/statics.service';
import { OrganisationService, CourseService, AllocationService } from 'src/app/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavigationExtras, Router } from '@angular/router';
import { Volunteer } from 'src/app/core/model/volunteer.model';
import { CustomSelectorComponent } from 'src/app/core/components/custom-selector/custom-selector.component';

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

  /**
   * List of all volunteers
   */
  volunteers = [];

  /**
   * List of available counties
   */
  counties = [];

  /**
   * List of available organisations
   */
  organisations = [];

  /**
   * List of a volunteer's courses
   */
  courses = [];

  /**
   * List of available courses
   */
  courseOptions = [];

  /**
   * List of available cities
   */
  cities = [];

  /**
   * String that contains the id of the volunteer that currently has the open details
   */
  volunteerIdWithDetails: string;

  /**
   * User selected county
   */
  selectedCounty: any;

  /**
   * User selected organisation
   */
  selectedOrganisation: string;

  /**
   * User selected course
   */
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
   * @param volunteerService Provider for volunteer related operations
   * @param staticsService Provider for location selection
   * @param organisationService Provider for organisation related operations
   * @param courseService Provider for course related operations
   * @param allocationService  Provider for volunteer allocation related operations
   * @param router Provider for route navigation
   * @param iab Provider for accessing an url in browser
   * @param modalController Controller for modal operations
   */
  constructor(private volunteerService: VolunteerService,
              private staticsService: StaticsService,
              private organisationService: OrganisationService,
              private courseService: CourseService,
              private allocationService: AllocationService,
              private router: Router,
              private iab: InAppBrowser,
              private modalController: ModalController) { }

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
    this.courseService.getCourseNames().subscribe((response: any) => {
      this.courseOptions = response.docs;
    });
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
   * @param volunteerId Selected volunteer id, if the message will be sent to only one recipient (optional parameter)
   * If no parameter is passed then the message will be sent to all volunteers in current page
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
    this.staticsService.getCountyList().subscribe((response) => {
      this.counties = response.rows.map(x => x.doc);
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
        response.docs.forEach(volunteer => {
          this.volunteers.push(volunteer);
        });
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
  loadData(event: any) {
    setTimeout(() => {
      this.page++;
      this.getData();
      event.target.complete();
    }, 500);
  }

  /**
   * Refreshes the data, on scroll up the page is reset
   * @param event Scroll event
   */
  doRefresh(event: any) {
    setTimeout(() => {
      this.page = 0;
      this.getData();
      event.target.complete();
    }, 1000);
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

  /**
   * Retrieves the list of cities that belong to the selected county
   */
  getCitiesList() {
    this.staticsService.getCityList(this.county._id).subscribe((response) => {
      this.cities = response.rows
        .map(x => ({
          _id: x.id,
          name: x.value
        }));
    });
  }

  /**
   * Prompts a scrollable modal view to replace the ion-selects; it is used in order
   * to optimize the view for a large group of datas
   * @param items The list of elements that will represent user's choices in the modal
   * @param callback A callback function that will be used in order to add the selection to the proper variable
   * @param event Click event that triggers the function call
   * @returns A promise for the async function
   */
  async presentModal(items: any, callback: any, event: any) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.cancelBubble = true;
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: CustomSelectorComponent,
      componentProps: {
        items
      }
    });

    modal.onDidDismiss()
      .then(res => {
        callback(res.data);
    });

    return await modal.present();
  }

  /**
   * Calls the present modal function with the appropriate callback function (for filter inputs)
   * @param items The list of elements that will be displayed in the modal
   * @param event Click event that triggers the function call
   * @param type String containing the calling selector type
   */
  filterModal(items: any, event: any, type: string) {
    this.presentModal(items, (res: any) => {
      if (type === 'county') {
        this.selectedCounty = res;
      }

      if (type === 'organisation') {
        this.selectedOrganisation = res;
      }

      if (type === 'course') {
        this.selectedCourse = res;
      }
    }, event);
  }

  /**
   * Calls the present modal function with the appropriate callback function (for allocation inputs)
   * @param items The list of elements that will be displayed in the modal
   * @param event Click event that triggers the function call
   * @param type String containing the calling selector type
   */
  allocationModal(items: any, event: any, type: string) {
    this.presentModal(items, (res: any) => {
      if (type === 'county') {
        this.county = res;
      }

      if (type === 'city') {
        this.city = res;
      }
    }, event);
  }
}

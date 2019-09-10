import { Component, OnInit } from '@angular/core';
import { VolunteerService } from 'src/app/core/service/volunteer.service';
import { AllocationService } from 'src/app/core/service/allocation.service';
import { StaticsService } from 'src/app/core/service/statics.service';
import { CourseService } from 'src/app/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavigationExtras, Router } from '@angular/router';
import { Volunteer } from 'src/app/core/model/volunteer.model';
import { ModalController } from '@ionic/angular';
import { CustomSelectorComponent } from 'src/app/core/components/custom-selector/custom-selector.component';

@Component({
  selector: 'app-validate-volunteer',
  templateUrl: './validate-volunteer.component.html',
  styleUrls: ['./validate-volunteer.component.scss'],
})

export class ValidateVolunteerComponent implements OnInit {
  /**
   * All volunteers
   */
  volunteers = [];

  /**
   * The keyword inserted by the user is the search bar
   */
  keyword = '';

  /**
   * String that contains the id of the volunteer that currently has the open details
   */
  volunteerIdWithDetails: string;

  /**
   * Open volunteer's courses
   */
  courses = [];

  /**
   * Open volunteer's last allocation
   */
  allocation = null;

  /**
   * All available counties
   */
  counties = [];

  /**
   * All available cities
   */
  cities = [];

  /**
   * Selected county
   */
  county: any;

  /**
   * Selected city
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
   * @param allocationService Provider for volunteer allocation related operations
   * @param staticsService Provider for location selection
   * @param courseService Provider for course related operations
   * @param router Provider for route navigation
   * @param iab Provider for accessing an url in browser
   * @param modalController Controller for modal operations
   */
  constructor(private volunteerService: VolunteerService,
              private allocationService: AllocationService,
              private staticsService: StaticsService,
              private courseService: CourseService,
              private router: Router,
              private iab: InAppBrowser,
              private modalController: ModalController) { }

  /**
   * Page initialisation
   */
  ngOnInit() {
   this.getData();
   this.getCountyList();
  }

  /**
   * Retrieves data, filtered by user's selections
   */
  getData() {
    if (this.page === 0) {
      this.volunteers = [];
    }

    this.volunteerService.getVolunteers(this.page, this.limit).subscribe((response: any) => {
      if (response.docs && response.docs.length > 0) {
        response.docs.forEach(volunteer => {
          volunteer.created_at = volunteer.created_at.replace(/\s/g, 'T');
          this.volunteers.push(volunteer);
        });
      }
    });
  }

  /**
   * Opens a details menu for the selected volunteer and closes all already opened ones
   * @param volunteerId String containing the id of the volunteer that was selected
   * @param allocationId String containing the id of the volunteer's last allocation
   */
  openMenu(volunteerId: string, allocationId: string) {
    this.courses = [];
    this.allocation = null;

    if (this.volunteerIdWithDetails === volunteerId) {
      this.volunteerIdWithDetails = null;
    } else {
      this.volunteerIdWithDetails = volunteerId;

      this.courseService.getCourseByVolunteerId(volunteerId).subscribe(response => {
        this.courses = response.docs;
      });

      this.allocationService.getAllocationById(allocationId).subscribe((response: any) => {
        this.allocation = response.docs[0];
      });
    }
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
   * Cancel the allocation process
   * @param volunteerId String containing the id of the volunteer that was initially selected for allocation
   */
  cancelAllocation(volunteerId: string) {
    this.city = null;
    this.county = null;
    const index = this.volunteers.findIndex(volunteer => volunteer._id === volunteerId);
    if (index >= 0) {
      this.volunteers[index].isInAllocation = false;
    }
  }

  /**
   * When a value is inserted in the search box, the function gets triggered and sends the inserted value to the volunteer service
   * if the value isn't null or empty, the response matches the user's input
   * otherwise it's the whole list of volunteers
   * @param event Change event
   */
  searchKeyword(event: any) {
    if (event && event.target) {
      this.keyword = event.target.value;

      if (this.keyword && this.keyword.trim() !== '') {
        this.volunteerService.search(this.keyword.toLowerCase(), this.page, 10).subscribe((data: any) => {
          this.volunteers = data.docs;
          if (data.docs.length >= 10) {
            this.page++;
          }
        });
      } else {
        this.page = 0;
        this.getData();
      }

    } else {
      this.page = 0;
      this.getData();
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
   * Retrives the list of counties from the locations service
   */
  getCountyList() {
    this.staticsService.getCountyList().subscribe((response) => {
      this.counties = response.rows.map(x => x.doc);
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
   * Retrieves the list of cities that belong to the selected county
   */
  getCitiesList() {
    this.cities = [];
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
   * @param isCityList True if the list of items contains city object, false if it contains counties
   * @param event The event that triggered the function call
   */
  async presentModal(items: any, isCityList: boolean, event: any) {
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
        if (isCityList) {
          this.city = res.data;
        } else {
          this.county = res.data;
        }
    });

    return await modal.present();
  }
}

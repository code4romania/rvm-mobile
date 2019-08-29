import { Component, OnInit } from '@angular/core';
import { VolunteerService } from 'src/app/core/service/volunteer.service';
import { AllocationService } from 'src/app/core/service/allocation.service';
import { LocationsService } from 'src/app/core/service/locations.service';
import { CourseService } from 'src/app/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavigationExtras, Router } from '@angular/router';
import { Volunteer } from 'src/app/core/model/volunteer.model';

@Component({
  selector: 'app-validate-volunteer',
  templateUrl: './validate-volunteer.component.html',
  styleUrls: ['./validate-volunteer.component.scss'],
})
export class ValidateVolunteerComponent implements OnInit {
  volunteers = [];
  keyword = '';

  /**
   * String that contains the id of the volunteer that currently has the open details
   */
  volunteerIdWithDetails: string;

  courses = [];
  counties = [];
  cities = [];
  county: any;
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
   * @param locationsService Provider for location selection
   * @param courseService Provider for course related operations
   * @param router Provider for route navigation
   * @param iab Provider for accessing an url in browser
   */
  constructor(private volunteerService: VolunteerService,
              private allocationService: AllocationService,
              private locationsService: LocationsService,
              private courseService: CourseService,
              private router: Router,
              private iab: InAppBrowser) { }

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
          this.volunteers.push(volunteer);
        });
      }
    });
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
   * Retrives the list of counties from the locations service
   */
  getCountyList() {
    this.locationsService.getCountyList().subscribe((response) => {
      this.counties = response;
    });
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
   * When a county is selected, the form's value is updated and starts retriving the list of cities from that county
   * @param event Changing event, triggered when a change is detected on an element
   */
  countySelectionChanged(event) {
    this.getCityList(event.detail.value);
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
}

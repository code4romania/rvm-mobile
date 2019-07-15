import { Component, OnInit } from '@angular/core';
import { VolunteerService } from 'src/app/core/service/volunteer.service';
import { OrganizationService } from 'src/app/core';

@Component({
  selector: 'app-validate-volunteer',
  templateUrl: './validate-volunteer.component.html',
  styleUrls: ['./validate-volunteer.component.scss'],
})
export class ValidateVolunteerComponent implements OnInit {
  users = [];
  keyword = '';
  userIdWithDetails: string;
  organizations = [];

  page = 0;
  limit = 10;

  constructor(private volunteerService: VolunteerService,
    private organizationService: OrganizationService) { }

  ngOnInit() {
   this.getData();
   this.getOrganizations();
  }

  getData() {
    if(this.page === 0) {
      this.users = [];
    }

    this.volunteerService.getVolunteers(this.page, this.limit, (response) => {
      response.forEach(volunteer => {
        this.users.push(volunteer.doc);
      });
    });
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
      this.users[index].isInAllocation = true;
    }
  }

  confirmAllocation(userId) {
    const index = this.users.findIndex(user => user._id === userId);
    if (index >= 0) {
      this.users[index].allocated = true;
      this.users[index].isInAllocation = false;
    }
  }

  searchKeyword() {
    this.volunteerService.search(this.keyword.toLowerCase(), 10);
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

  getOrganizations() {
    this.organizationService.getOrganizations((result) => {
      result.forEach(row => {
        this.organizations.push(row.doc);
      });
    });
  }
}

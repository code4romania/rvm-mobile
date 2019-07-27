import { Component, OnInit } from '@angular/core';
import { VolunteerService } from 'src/app/core/service/volunteer.service';

@Component({
  selector: 'app-validate-volunteer',
  templateUrl: './validate-volunteer.component.html',
  styleUrls: ['./validate-volunteer.component.scss'],
})
export class ValidateVolunteerComponent implements OnInit {
  volunteers = [];
  keyword = '';
  volunteerIdWithDetails: string;

  page = 0;
  limit = 10;

  constructor(private volunteerService: VolunteerService) { }

  ngOnInit() {
   this.getData();
  }

  getData() {
    if(this.page === 0) {
      this.volunteers = [];
    }

    this.volunteerService.getVolunteers(this.page, this.limit).subscribe((response: any) => {
      response.rows.forEach(volunteer => {
        this.volunteers.push(volunteer.doc);
      });
    });
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
      this.volunteers[index].isInAllocation = true;
    }
  }

  confirmAllocation(volunteerId) {
    const index = this.volunteers.findIndex(volunteer => volunteer._id === volunteerId);
    if (index >= 0) {
      this.volunteers[index].allocated = true;
      this.volunteers[index].isInAllocation = false;
    }
  }

  searchKeyword() {
    if(this.keyword !== ''){
      this.volunteerService.search(this.keyword.toLowerCase(), this.page, 10).subscribe((data: any) => {
        this.volunteers = data.docs;
        if(data.docs.length > 0) {
          this.page++;
        }
      });
    } else {
      this.page = 0;
      this.getData();
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

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/service/user.service';

@Component({
  selector: 'app-validate-volunteer',
  templateUrl: './validate-volunteer.component.html',
  styleUrls: ['./validate-volunteer.component.scss'],
})
export class ValidateVolunteerComponent implements OnInit {
  users = [];
  keyword = '';
  userIdWithDetails: string;

  page = 0;
  limit = 10;

  constructor(private userService: UserService) { }

  ngOnInit() {
   this.getData();
  }

  getData() {
    if(this.page === 0) {
      this.users = [];
    }

    this.userService.getUsers(this.page, this.limit, (response) => {
      response.forEach(user => this.users.push(user));
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
    this.userService.search(this.keyword.toLowerCase(), 10);
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

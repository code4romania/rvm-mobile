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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users = this.userService.getUsers();
    this.users.forEach((user, index) => {
      this.users[index].isInAllocation = false;  
      this.users[index].menuOpen = false;
      this.users[index].allocated = false;
    });
  }

  openMenu(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index >= 0) {
      if (!this.users[index].menuOpen) {
        this.users.forEach((user) => this.closeMenu(user.id));
        this.users[index].menuOpen = true;
      } else {
        this.closeMenu(userId);
      }
    }
  }

  closeMenu(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index >= 0) {
      this.users[index].menuOpen = false;
    }
  }

  allocateUser(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index >= 0) {
      this.users[index].isInAllocation = true;
    }
  }

  confirmAllocation(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index >= 0) {
      this.users[index].allocated = true;
      this.users[index].isInAllocation = false;
    }
  }

  searchKeyword() {
    this.users = this.userService.search(this.keyword.toLowerCase());
  }
}

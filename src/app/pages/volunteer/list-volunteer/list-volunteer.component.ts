import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/service/user.service';

@Component({
  selector: 'app-list-volunteer',
  templateUrl: './list-volunteer.component.html',
  styleUrls: ['./list-volunteer.component.scss'],
})
export class ListVolunteerComponent implements OnInit {
  users = [];
  keyword = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  openMenu(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index >= 0) {
      if (!this.users[index].menuOpen) {
        this.users.forEach((user) => this.closeMenu(user.id));
        this.users[index].menuOpen = true;
      } else {
        this.users[index].menuOpen = false;
      }
    }
  }

  closeMenu(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index >= 0) {
      this.users[index].menuOpen = false;
    }
  }

  sendMessage(userId) {
    console.log('send messege to: ', userId);
  }

  allocateUser(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index >= 0) {
      this.users[index].allocated = true;
    }
  }

  sendAlert() {
    console.log('Alert sent');
  }
}

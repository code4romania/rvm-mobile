import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseAPIClass } from '../class/baseAPI.class';

@Injectable()
export class UserService extends BaseAPIClass {
  users = [
    {
      id: 1,
      name: 'Marius Costache',
      organization: 'Crucea Rosie',
      acredited: 'prim-ajutor',
      occupation: 'Medic rezident',
      registered: '20.01.2018'
    },
    {
      id: 2,
      name: 'Marius Damian',
      organization: 'Habitat for Humanity',
      acredited: 'lucrari de constructie',
      occupation: 'Inginer Constructor',
      registered: '14.11.2016'
    },
    {
      id: 3,
      name: 'Marius Costache',
      organization: 'Crucea Rosie',
      acredited: 'prim-ajutor',
      occupation: 'Medic rezident',
      registered: '20.01.2018'
    },
    {
      id: 4,
      name: 'Marius Damian',
      organization: 'Habitat for Humanity',
      acredited: 'lucrari de constructie',
      occupation: 'Inginer Constructor',
      registered: '14.11.2016'
    },
    {
      id: 5,
      name: 'Marius Costache',
      organization: 'Crucea Rosie',
      acredited: 'prim-ajutor',
      occupation: 'Medic rezident',
      registered: '20.01.2018'
    },
    {
      id: 6,
      name: 'Marius Damian',
      organization: 'Habitat for Humanity',
      acredited: 'lucrari de constructie',
      occupation: 'Inginer Constructor',
      registered: '14.11.2016'
    },
  ];

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
    this.baseUrl = '/user';
  }

  getUsers() {
    return this.users;
  }

  search(keyword: string) {
    return this.users.filter(user => user.name.toLowerCase().includes(keyword));
  }
}

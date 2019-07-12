import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';

var localDB = new PouchDB('laravel');
PouchDB.plugin(PouchDBFind);
var remoteDB = new PouchDB(environment.databaseURL + '/laravel');

@Injectable()
export class UserService {
  private type = 'users';

  constructor() {
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

   localDB.sync(remoteDB, options);    

    localDB.createIndex({
      index: {fields: ['type', 'name', 'CNP', 'organization', 'county', 'specialization']}
    });
   }

  getUsers(page: number, limit: number, callback) {
    const skip = page * limit;
    localDB.find({
      selector: {
        type: {$eq: this.type},
      },
      limit: limit,
      skip: skip
    }).then((result) => {
      callback(result.docs);
    });
  }

  search(keyword: string, limit) {
    localDB.find({
      selector: {
        type: {$eq: this.type},
        name: {$eq: keyword},
      },
      sort: ['name'],
      limit: limit
    }).then((result) => {
      console.log(result);
    });
  }

  getUserById(userId, callback) {
    localDB.find({
      selector: {
        _id: {$eq: userId},
        type: {$eq: this.type},
      }
    }).then((result) => {
      callback(result);
    });
  }

  createUser(user) {
    localDB.put(user);
  }

  updateUser(user) {
    localDB.get(user._id).then(function (doc) {
      doc.name = user.name ? user.name : doc.name;
      doc.occupation = user.occupation ? user.occupation : doc.occupation;
      doc.organization = user.organization ? user.organization : doc.organization;
      doc.registered = user.registered ? user.registered : doc.registered;
      localDB.put(doc);
    });
  }

  deleteUserById(userId) {
    localDB.get(userId).then(function (doc) {
      return localDB.remove(doc);
    });
  }

  filter(county: string, organization: string, specialization: string, page:number, limit: number, callback) {
    const skip = page * limit;
    let selector:any = {
      type: {$eq: this.type}
    };

    if(county) {
      selector.county = {$eq: county};
    }

    if(organization) {
      selector.organization = {$eq: organization};
    }

    if(specialization) {
      selector.specialization = {$eq: specialization};
    }

    localDB.find({
      selector: selector,
      limit: limit,
      skip: skip
    }).then((result) => {
      callback(result.docs);
    });
  }
}
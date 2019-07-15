import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';

var localDB = new PouchDB('organization');
PouchDB.plugin(PouchDBFind);
var remoteDB = new PouchDB(environment.databaseURL + '/organization');

@Injectable()
export class OrganizationService {

  constructor() {
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

   localDB.sync(remoteDB, options);    

    localDB.createIndex({
      index: {fields: ['name']}
    });
   }

  getOrganizations(callback) {
    localDB.allDocs({
      include_docs: true,
      attachments: true
    }).then((result) => {
      const data = result.rows.filter(item => item.doc.language !== 'query');
      callback(data);
    });
  }

  getOrganizationById(organizationId, callback) {
    localDB.find({
      selector: {
        _id: {$eq: organizationId},
      }
    }).then((result) => {
      callback(result);
    });
  }

  createOrganization(name: string, userId: string) {
    const id = Math.floor(Math.random() * 1000000000).toString();
    let organization = {
        '_id': id,
        'name': name,
        'added_by': userId
    };
  console.log(organization);  
    localDB.put(organization);
  }

  updateOrganization(organization) {
    localDB.get(organization._id).then(function (doc) {
      doc.name = organization.name ? organization.name : doc.name;
      localDB.put(doc);
    });
  }

  deleteOrganizationById(organizationId) {
    localDB.get(organizationId).then(function (doc) {
      return localDB.remove(doc);
    });
  }
}
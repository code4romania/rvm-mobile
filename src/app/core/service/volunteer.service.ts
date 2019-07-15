import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { Volunteer } from '../model/volunteer.model';
import { CourseService } from './course.service';
var localDB = new PouchDB('volunteer');
PouchDB.plugin(PouchDBFind);
var remoteDB = new PouchDB(environment.databaseURL + '/volunteer');

@Injectable()
export class VolunteerService {

  constructor(private courseService: CourseService) {
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

   localDB.sync(remoteDB, options);    

    localDB.createIndex({
      index: {fields: ['name', 'ssn', 'organization_id', 'county', 'city', 'job', 'comments']}
    });
   }

  getVolunteers(page: number, limit: number, callback) {
    const skip = page * limit;
    localDB.allDocs({
        limit: limit,
        include_docs: true,
        skip: skip,

    }).then((result) => {

      const data = result.rows.filter(item => item.doc.language !== 'query');
      callback(data);
    });
  }

  search(keyword: string, limit) {
    localDB.find({
      selector: {
        name: {$eq: keyword},
      },
      sort: ['name'],
      limit: limit
    }).then((result) => {
      console.log(result);
    });
  }

  getVolunteerById(volunteerId, callback) {
    localDB.find({
      selector: {
        _id: {$eq: volunteerId},
      }
    }).then((result) => {
      callback(result);
    });
  }

  createVolunteer(name: string, ssn: string, county: string, city: string, organization_id: string, course: string) {
    let volunteer = new Volunteer;
    volunteer._id = Math.floor(Math.random() * 1000000000).toString();
    volunteer.name = name;
    volunteer.ssn = ssn;
    volunteer.county = county;
    volunteer.city = city;
    volunteer.organization_id = organization_id;
    localDB.put(volunteer);
    this.courseService.createCourse(volunteer._id, course);
  }

  updateVolunteer(volunteer) {
    localDB.get(volunteer._id).then(function (doc) {
      doc.name = volunteer.name ? volunteer.name : doc.name;
      doc.ssn = volunteer.ssn ? volunteer.ssn : doc.ssn;
      doc.county = volunteer.county ? volunteer.county : doc.county;
      doc.city = volunteer.city ? volunteer.city : doc.city;
      doc.organization_id = volunteer.organization_id ? volunteer.organization_id : doc.organization_id;
      doc.comments = volunteer.comments ? volunteer.comments : doc.comments;
      doc.job = volunteer.job ? volunteer.job : doc.job;
      localDB.put(doc);
    });
  }

  deleteVolunteerById(volunteerId) {
    localDB.get(volunteerId).then(function (doc) {
      return localDB.remove(doc);
    });
  }

  filter(county: string, organization: string, job: string, page:number, limit: number, callback) {
    const skip = page * limit;
    let selector:any = {};

    if(county) {
      selector.county = {$eq: county};
    }

    if(organization) {
      selector.organization = {$eq: organization};
    }

    if(job) {
      selector.job = {$eq: job};
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
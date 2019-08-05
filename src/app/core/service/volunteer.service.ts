import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { Volunteer } from '../model/volunteer.model';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseService } from './course.service';

/**
 * Reference for local PouchDB Volunteers Database
 */
var localDB = new PouchDB('volunteers');

/**
 * PouchDB find plugin added 
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Volunteers Database
 */
var remoteDB = new PouchDB(environment.databaseURL + '/volunteers');

/**
 * Provider for volunteer related operations
 */
@Injectable()
export class VolunteerService {

   /**
   * Class constructor, sets the synchronization options for CouchDB and PouchDB Volunteers Database
   * @param courseService Provider for course related operations
   */
  constructor(private courseService: CourseService) {
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    localDB.sync(remoteDB, options);    

    localDB.createIndex({
      index: {fields: ['name', 'ssn', 'organisation.name','course.[].name', 'organisation.id', 'county', 'city', 'job', 'comments']}
    });
   }

  /**
  * Getter method for all volunteers from the local database
  * @params page A number defining the current page of volunteers from the total list (used to paginate the response)
  * @params limit The number of volunteers per page
  * @returns An Observable with all volunteers
  */
  getVolunteers(page: number, limit: number): Observable<any> {
    const skip = page * limit;
    return from(localDB.allDocs({
        limit: limit,
        include_docs: true,
        skip: skip,
        endkey: "_design"
    }));
  }
 
  /**
  * Searches for all volunteers from the local database whose name,ssn or organisation name matches the keyword
  * @param keyword The string used for search
  * @param page A number defining the current page of volunteers from the total list (used to paginate the response)
  * @param limit The number of volunteers per page
  * @returns An Observable with all volunteers
  */
  search(keyword: string, page: number, limit: number): Observable<any> {
    const skip = page * limit;
    const pattern = new RegExp('.*' + keyword + '.*','ig');
    return from(localDB.find({
      selector: {
        "$or": [
          {
          "name": {$regex: pattern},
          },
           {
             "ssn": {$regex: pattern},
           },
           {
             "organisation.name": {$regex: pattern},
           },
        ]        
      },
      limit: limit,
      include_docs: true,
      skip: skip,
      endkey: "_design"
    }));
  }

   /**
  * Finds a volunteer by its id in the local database
  * @param volunteerId Volunteer's id
  * @returns An Observable containing the volunteer with that id
  */
  getVolunteerById(volunteerId: string): Observable<any> {
    return from(localDB.find({
      selector: {
        _id: {$eq: volunteerId},
      }
    }));
  }

  /**
  * Finds a volunteer by its ssn in the local database
  * @param ssn A ssn code
  * @returns An Observable containing the volunteer with that id
  */
  getVolunteerBySsn(ssn: string): Observable<any> {
    return from(localDB.find({
      selector: {
        ssn: {$eq: ssn},
      }
    }));
  }

  /**
   *  Creates a volunteer entry in the local database
   * @param name String value containing the new volunteer's name
   * @param ssn String value containing the new volunteer's ssn (Social Security Number)
   * @param phone String value containing the new volunteer's phone number
   * @param county String value containing the new volunteer's county
   * @param city String value containing the new volunteer's city
   * @param organisation Object value containing the new volunteer's organisation 
   * Either contains an object with the following properties {id, name, website}, or it's null
   * @param course Volunteer's course with properties: {id, name, acredited, obtained}
   * @returns An Observable with the created object
   */
  createVolunteer(name: string, ssn: string, phone: string, county: string, city: string, organisation: any, course: any): Observable<any> {
    let volunteer = new Volunteer;
    volunteer.name = name;
    volunteer.ssn = ssn;
    volunteer.county = county;
    volunteer.city = city;
    volunteer.created = new Date();
    volunteer.updated = new Date();
    volunteer.allocation = '';
    volunteer.phone = phone;

    if(organisation) {
      volunteer.organisation = {
        "id": organisation._id,
        "name": organisation.name,
        "website": organisation.website
      };
    } else {
      volunteer.organisation = null;
    }

    return from(localDB.post(volunteer))
    .pipe(
        map((response) => {
          if(course) {
            this.courseService.createCourse(course.name, volunteer._id, course.acredited, course.obtained).subscribe(() => {});
          }
          return response;
        })
      );
  }

   /**
  * Updates a volunteer entry in the local database
  * @param volunteer The new volunteer entry
  */
  updateVolunteer(volunteer: Volunteer) {
    localDB.get(volunteer._id).then(function (doc) {
      doc.name = volunteer.name ? volunteer.name : doc.name;
      doc.ssn = volunteer.ssn ? volunteer.ssn : doc.ssn;
      doc.phone = volunteer.phone ? volunteer.phone : doc.phone;
      doc.county = volunteer.county ? volunteer.county : doc.county;
      doc.city = volunteer.city ? volunteer.city : doc.city;
      doc.organisation = volunteer.organisation ? volunteer.organisation : doc.organisation;
      doc.comments = volunteer.comments ? volunteer.comments : doc.comments;
      doc.job = volunteer.job ? volunteer.job : doc.job;
      doc.updated = new Date();
      localDB.put(doc);
    });
  }

   /**
   * Deletes an entry by its id from the local database
   * @param volunteerId The volunteer id
   */
  deleteVolunteerById(volunteerId: string) {
    localDB.get(volunteerId).then(function (doc) {
      localDB.remove(doc);
    });
  }

  /**
   * Filters local Volunteers database by the given parameters' values
   * @param county County name
   * @param organisationId Organisation id
   * @param courseName Course Name
   * @param page A number defining the current page of volunteers from the total list (used to paginate the response)
   * @param limit The number of volunteers per page
   * @returns An Observable with all volunteers matching the filters
   */
  filter(county: string, organisationId: string, courseName: string, page:number, limit: number): Observable<any> {
    const skip = page * limit;
    let selector:any = {"$and" : []};

      
    if(county !== 'all') {
      selector['$and'].push( {
        "county": {$eq: county},
      });
    }

    if(organisationId) {
      selector['$and'].push(  {
        "organisation.id": {$eq: organisationId},
      });
    }

    if(courseName) {
      selector['$and'].push( {"courses": {
        "$elemMatch" : {
          "name": {$eq: courseName},
          }
        }
      });
    }

    return from(localDB.find({
      selector: selector,
      limit: limit,
      skip: skip
    }));
  }

  /**
   * Searches for a volunteer with the given volunteer id and allocates it
   * @param allocationId Last allocation id
   * @param volunteerId Volunteer id
   */
  allocateVolunteer(allocationId: string, volunteerId: string) {
    return localDB.get(volunteerId).then(function (doc) {
      doc.allocation = allocationId;
      doc.updated = new Date();
      localDB.put(doc);
    });
  }
}
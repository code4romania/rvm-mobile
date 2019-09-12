import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { Volunteer } from '../model/volunteer.model';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseService } from './course.service';
import * as moment from 'moment';

/**
 * Reference for local PouchDB Volunteers Database
 */
const localDB = new PouchDB('volunteers');

/**
 * PouchDB find plugin added
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Volunteers Database
 */
const remoteDB = new PouchDB(environment.databaseURL + '/volunteers');

/**
 * Provider for volunteer related operations
 */
@Injectable()
export class VolunteerService {

  /**
   * Table type
   */
  private type = 'volunteers';

   /**
    * Class constructor, sets the synchronization options for CouchDB and PouchDB Volunteers Database
    * @param courseService Provider for course related operations
    */
  constructor(private courseService: CourseService) {
    const options = {
      live: true,
      retry: true,
      continuous: true
    };

    localDB.sync(remoteDB, options);

    localDB.createIndex({
      index: {
        fields: [
          'name',
          'slug',
          'ssn',
          'organisation.slug',
          'course.[].course_name._id',
          'organisation._id',
          'county._id',
          'city._id',
          'job',
          'comments'
      ]}
    });
   }

  /**
   * Getter method for all volunteers from the local database
   * @param page A number defining the current page of volunteers from the total list (used to paginate the response)
   * @param limit The number of volunteers per page
   * @returns An Observable with all volunteers
   */
  getVolunteers(page: number, limit: number): Observable<any> {
    const skip = page * limit;

    return from(localDB.find({
      selector: {
          type: this.type
      },
      limit,
      include_docs: true,
      skip,
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
    keyword = this.removeSpecialChars(keyword);
    const pattern = new RegExp('.*' + keyword + '.*', 'ig');
    return from(localDB.find({
      selector: {
        $and: [
          {
            $or: [
              {
                slug: {$regex: pattern},
              },
              {
                ssn: {$regex: pattern},
              },
              {
                'organisation.slug': {$regex: pattern},
              },
            ]
          },
          {
            type: this.type
          }
        ]
      },
      limit,
      include_docs: true,
      skip,
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
        type: this.type
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
        type: this.type
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
   * @param course Volunteer's course with properties: {id, name, accredited, obtained}
   * @returns An Observable with the created object
   */
  createVolunteer(name: string, ssn: string, phone: string, county: any, city: any, organisation: any, course: any): Observable<any> {
    const volunteer = new Volunteer();
    volunteer.name = name;
    volunteer.ssn = ssn;
    volunteer.county = {
      _id: county._id,
      name: county.name
    };
    volunteer.city = {
      _id: city._id,
      name: city.name
    };
    volunteer.created_at = moment().format('Y-MM-DD HH:mm:ss');
    volunteer.updated_at = moment().format('Y-MM-DD HH:mm:ss');
    volunteer.allocation = '';
    volunteer.phone = phone;
    volunteer.slug = this.removeSpecialChars(name);
    volunteer.type = this.type;

    if (organisation) {
      volunteer.organisation = {
        _id: organisation._id,
        name: organisation.name,
        website: organisation.website,
        slug: this.removeSpecialChars(organisation.name)
      };
    } else {
      volunteer.organisation = null;
    }

    volunteer.courses = [];

    if (course && course._id) {
      const newCourse = {
        course_name : {
          _id: course._id,
          name: course.name,
          slug: course.slug
        },
        obtained: null,
        accredited: null
      };
      volunteer.courses.push(newCourse);
    }

    return from(localDB.post(volunteer));
  }

   /**
    * Updates a volunteer entry in the local database
    * @param volunteer The new volunteer entry
    */
  updateVolunteer(volunteer: Volunteer) {
    localDB.get(volunteer._id).then((doc: Volunteer) => {
      doc.name = volunteer.name ? volunteer.name : doc.name;
      doc.slug = volunteer.name ? this.removeSpecialChars(volunteer.name) : doc.slug;
      doc.ssn = volunteer.ssn ? volunteer.ssn : doc.ssn;
      doc.email = volunteer.email ? volunteer.email : doc.email;
      doc.phone = volunteer.phone ? volunteer.phone : doc.phone;
      doc.county = volunteer.county ? volunteer.county : doc.county;
      doc.city = volunteer.city ? volunteer.city : doc.city;
      doc.organisation = volunteer.organisation ? volunteer.organisation : doc.organisation;
      doc.courses = volunteer.courses ? volunteer.courses : doc.courses;
      doc.comments = volunteer.comments ? volunteer.comments : doc.comments;
      doc.job = volunteer.job ? volunteer.job : doc.job;
      doc.allocation = volunteer.allocation ? volunteer.allocation : doc.allocation;
      doc.updated_at = moment().format('Y-MM-DD HH:mm:ss');
      localDB.put(doc);
    });
  }

   /**
    * Deletes an entry by its id from the local database
    * @param volunteerId The volunteer id
    */
  deleteVolunteerById(volunteerId: string) {
    localDB.get(volunteerId).then((doc) => {
      localDB.remove(doc);
    });
  }

  /**
   * Filters local Volunteers database by the given parameters' values
   * @param county County object
   * @param organisationId Organisation object
   * @param course Course name object
   * @param page A number defining the current page of volunteers from the total list (used to paginate the response)
   * @param limit The number of volunteers per page
   * @returns An Observable with all volunteers matching the filters
   */
  filter(county: any, organisation: any, course: any, page: number, limit: number): Observable<any> {
    const skip = page * limit;
    const selector: any = {$and : []};

    selector['$and'].push( {
      type: this.type,
    });

    if (!!county && !!county._id) {
      selector['$and'].push( {
        'county._id': {$eq: county._id},
      });
    }

    if (!!organisation && organisation._id) {
      selector['$and'].push(  {
        'organisation._id': {$eq: organisation._id},
      });
    }

    if (!!course && !!course._id) {
      selector['$and'].push( {courses: {
        $elemMatch : {
          'course_name._id': {$eq: course._id},
          }
        }
      });
    }

    return from(localDB.find({
      selector,
      limit,
      skip
    }));
  }

  /**
   * Searches for a volunteer with the given volunteer id and allocates it
   * @param allocationId Last allocation id
   * @param volunteerId Volunteer id
   */
  allocateVolunteer(allocationId: string, volunteerId: string) {
    return localDB.get(volunteerId).then((doc) => {
      doc.allocation = allocationId;
      doc.updated_at = moment().format('Y-MM-DD HH:mm:ss');
      localDB.put(doc);
    });
  }

  /**
   * Removes diacritics from a string
   * @param text A string with diacritics
   * @returns the new string, without diacritics
   */
  private removeSpecialChars(text: string): string {
      const input   = 'ăâîșț';
      const output  = 'aaist';
      const regex = new RegExp('[' + input + ']', 'g');
      const transl = {};

      const lookup = (m) => transl[m] || m;

      for (let i = 0; i < input.length; i++) {
        transl[input[i]] = output[i];
      }

      return text.replace(regex, lookup);
  }
}

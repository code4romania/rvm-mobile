import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { from } from 'rxjs';
import { AuthenticationService } from '../authentication';

/**
 * Reference for local PouchDB Courses Database
 */
const localDB = new PouchDB('courses');

/**
 * PouchDB find plugin added
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Courses Database
 */
const remoteDB = new PouchDB(environment.databaseURL + '/courses');

/**
 * Provider for course related operations
 */
@Injectable()
export class CourseService {

  /**
   * Courses' table type (if the course is not a static value)
   */
  private type = 'courses';

  /**
   * Course's names table type
   */
  private courseNamesType = 'course_names';

  /**
   * Class constructor, sets the synchronization options for CouchDB and PouchDB Courses Database
   * @param authService Provider for authentication related operations
   */
  constructor(private authService: AuthenticationService) {
    const options = {
      live: true,
      retry: true,
      continuous: true
    };

    localDB.sync(remoteDB, options);
   }

  /**
   * Returns all course names for selection
   */
  getCourseNames() {
    return from(localDB.find({
      selector: {
          type: 'course_names'
      },
      include_docs: true,
      attachments: true
    }));
  }
}

import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';
import { Course } from '../model/course.model';
import { AuthenticationService } from '../authentication';
import * as moment from 'moment';

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
  private type = 'courses';

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

    localDB.createIndex({
      index: {fields: ['course_name.id', 'volunteer_id', 'acredited.id']}
    });
   }

  /**
   * Getter method for all courses from the local database
   * @returns An Observable with all courses
   */
  getCourses(): Observable<any> {
    return from(localDB.find({
      selector: {
          type: this.type
      },
      include_docs: true,
      attachments: true
    }));
  }

  /**
   * Finds a course by its name in the local database
   * @param courseNameId Course name id from statics database
   * @returns An Observable with all courses with that name
   */
  getCourseByName(courseNameId: string): Observable<any> {
    return from(localDB.find({
      selector: {
        'course_name.id': {$eq: courseNameId},
        type: this.type
      },
      sort: ['course_name.id'],
    }));
  }

  /**
   * Finds a course by its id in the local database
   * @param courseId Course's id
   * @returns An Observable containing the course with that id
   */
  getCourseById(courseId: string): Observable<any> {
    return from(localDB.find({
      selector: {
        _id: {$eq: courseId},
        type: this.type
      }
    }));
  }

  getCourseByVolunteerId(volunteerId: string): Observable<any> {
    return from(localDB.find({
      selector: {
        volunteer_id: {$eq: volunteerId},
        type: this.type
      }
    }));
  }

  /**
   * Creates a course entry in the local database
   * @param courseName Entry from statics courses database
   * @param volunteer_id The id of the volunteer that is acredited for this course
   */
  createCourse(courseName: any, volunteer_id: string): Observable<any> {
    const course = new Course();
    course.volunteer_id = volunteer_id;
    course.course_name = courseName;
    course.created_at = moment().format('Y-MM-DD H:mm:ss');
    course.updated_at = moment().format('Y-MM-DD H:mm:ss');
    course.added_by = this.authService.user._id;
    course.type = this.type;

    return from(localDB.post(course));
  }

  /**
   * Updates a course entry in the local database
   * @param course The new course entry
   */
  updateCourse(course: Course): void {
    localDB.get(course._id).then((doc: Course) => {
      doc.course_name = course.course_name ? course.course_name : doc.course_name;
      doc.acredited = course.acredited ? course.acredited : doc.acredited;
      doc.obtained = course.obtained ? course.obtained : doc.obtained;
      doc.updated_at = new Date();
      localDB.put(doc);
    });
  }

  /**
   * Deletes an entry by its id from the local database
   * @param courseId The course id
   */
  deleteCourseById(courseId: string): void {
    localDB.get(courseId).then(doc => {
      return localDB.remove(doc);
    });
  }
}

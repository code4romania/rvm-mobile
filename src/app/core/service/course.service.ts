import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';
import { Course } from '../model/course.model';

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
   */
  constructor() {
    const options = {
      live: true,
      retry: true,
      continuous: true
    };

    localDB.sync(remoteDB, options);

    localDB.createIndex({
      index: {fields: ['name', 'volunteer_id', 'acredited']}
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
   * @param courseName The name of the course
   * @returns An Observable with all courses with that name
   */
  getCourseByName(courseName: string): Observable<any> {
    return from(localDB.find({
      selector: {
        name: {$eq: courseName},
        type: this.type
      },
      sort: ['name'],
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
   * @param name String value containing the new course's name
   * @param volunteer_id String value containing the volunteer's id
   * @param obtained Date value when a course was obtained
   * @returns An Observable with the created object
   */
  createCourse(name: string, volunteer_id: string, acredited: string, obtained: Date): Observable<any> {
    const course = new Course();
    course.volunteer_id = volunteer_id;
    course.name = name;
    course.obtained = obtained;
    course.acredited = acredited;
    course.type = this.type;

    return from(localDB.post(course));
  }

  /**
   * Updates a course entry in the local database
   * @param course The new course entry
   */
  updateCourse(course: Course): void {
    localDB.get(course._id).then((doc) => {
      doc.name = course.name ? course.name : doc.name;
      doc.acredited = course.acredited ? course.acredited : doc.acredited;
      doc.obtained = course.obtained ? course.obtained : doc.obtained;
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

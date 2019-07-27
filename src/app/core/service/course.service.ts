import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';
import { Course } from '../model/course.model';

/**
 * Reference for local PouchDB Courses Database
 */
var localDB = new PouchDB('courses');

/**
 * PouchDB find plugin added 
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Courses Database
 */
var remoteDB = new PouchDB(environment.databaseURL + '/courses');

/**
 * Provider for course related operations
 */
@Injectable()
export class CourseService {

  /**
   * Class constructor, sets the synchronization options for CouchDB and PouchDB Courses Database
   */
  constructor() {
    let options = {
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
    return from(localDB.allDocs({
      include_docs: true
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
      }
    }));
  }

  /**
   * Creates a course entry in the local database
   * @param name String value containing the new course's name
   * @param volunteer_id String value containing the volunteer's id
   * @returns An Observable with the object created
   */
  createCourse(name: string, volunteer_id: string): Observable<any> {
    const id = Math.floor(Math.random() * 1000000000).toString();
    const course = {
        '_id': id,
        'volunteer_id': volunteer_id,
        'name': name
    };

    return from(localDB.put(course));
  }
 
  /**
  * Updates a course entry in the local database
  * @param course The new course entry
  */
  updateCourse(course: Course): void {
    localDB.get(course._id).then(function (doc) {
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
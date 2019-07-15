import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';

var localDB = new PouchDB('course');
PouchDB.plugin(PouchDBFind);
var remoteDB = new PouchDB(environment.databaseURL + '/course');

@Injectable()
export class CourseService {

  constructor() {
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

   localDB.sync(remoteDB, options);    

    localDB.createIndex({
      index: {fields: ['name', 'volunteer_id']}
    });
   }

  getCourses(callback) {
    localDB.allDocs({
      include_docs: true
    }).then((result) => {
      const data = result.rows.filter(item => item.doc.language !== 'query');
      callback(data);
    });
  }

  search(keyword: string, limit, callback) {
    localDB.find({
      selector: {
        name: {$eq: keyword},
      },
      sort: ['name'],
      limit: limit
    }).then((result) => {
      callback(result);
    });
  }

  getCourseById(courseId, callback) {
    localDB.find({
      selector: {
        _id: {$eq: courseId},
      }
    }).then((result) => {
      callback(result);
    });
  }

  getCourseByName(name, callback) {
    localDB.find({
      selector: {
        name: {$eq: name},
      }
    }).then((result) => {
      callback(result);
    });
  }

  createCourse(name: string, volunteer_id: string) {
    const id = Math.floor(Math.random() * 1000000000).toString();
    const course = {
        '_id': id,
        'volunteer_id': volunteer_id,
        'name': name
    };

    localDB.put(course);
  }

  updateCourse(course) {
    localDB.get(course._id).then(function (doc) {
      doc.name = course.name ? course.name : doc.name;
      doc.acredited = course.acredited ? course.acredited : doc.acredited;
      doc.obtained = course.obtained ? course.obtained : doc.obtained;
      localDB.put(doc);
    });
  }

  deleteCourseById(courseId) {
    localDB.get(courseId).then(function (doc) {
      return localDB.remove(doc);
    });
  }
}